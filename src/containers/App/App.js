import React from 'react';
import Controls from '../../components/Controls/Controls';
import Button from '../../components/Button/Button';
import Field from '../../components/Field/Field';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			cells: [],
			generation: 0,
			speeds: {
				fast: 20,
				medium: 10,
				slow: 2
			},
			size: 'medium',
			width: 25,
			height: 25
		};
		this.currentSpeed = this.state.speeds.medium;
		this.cellTotalAmount = this.state.width * this.state.height;
		this.cellStates = ['alive', 'dead', 'young'];
		this.isPaused = false;
		this.animation = null;

		this.start = () => {
			this.cellTotalAmount = this.state.width * this.state.height;
			if (!this.isPaused) {
				this.generateCells({ random: true });
			} else {
				this.isPaused = false;
			}
			this.startAnimating();
		};

		this.pause = this.pause.bind(this);
		this.setSpeed = this.setSpeed.bind(this);
		this.changeSize = this.changeSize.bind(this);

		this.clear = () => {
			cancelAnimationFrame(this.animation);
			this.setState({
				cells: [],
				generation: 0
			});
			this.generateCells({ random: false });
		};

		this.checkCell = cell => {
			let modifiedCells = this.state.cells.slice();
			modifiedCells[cell - 1].state = 'alive';
			this.setState({
				cells: modifiedCells
			});
		};
	}

	componentDidMount() {
		this.start();
	}

	pause() {
		this.isPaused = true;
		cancelAnimationFrame(this.animation);
	}

	getRandomCellState() {
		return this.cellStates[
			Math.floor(Math.random() * this.cellStates.length)
		];
	}

	generateCells(type) {
		let generatedCells = [];
		let currentCell = {};
		for (var i = 0; i < this.cellTotalAmount; i++) {
			currentCell = {};
			if (type.random) {
				currentCell.state = this.getRandomCellState();
			} else {
				currentCell.state = 'dead';
			}
			currentCell.key = (i + 1).toString();
			currentCell.id = i + 1;
			generatedCells.push(currentCell);
		}
		this.setState({
			cells: generatedCells
		});
	}

	startAnimating() {
		let fpsInterval = 1000 / this.currentSpeed;
		let then = Date.now();
		let elapsed, now;
		(function scanRepeat() {
			this.animation = requestAnimationFrame(scanRepeat.bind(this));
			now = Date.now();
			elapsed = now - then;
			// if enough time has elapsed, draw the next frame
			if (elapsed > fpsInterval) {
				then = now - elapsed % fpsInterval;
				this.scan();
			}
		}.bind(this)());
	}

	scan() {
		const appData = {
			width: this.state.width,
			height: this.state.height,
			arrLength: this.cellTotalAmount,
			cells: this.state.cells.slice()
		};
		const modifiedCells = this.checkNeighbours(appData);

		this.setState(prevState => {
			cells: modifiedCells;
			generation: prevState.generation++;
		});
	}

	setSpeed(speed) {
		this.currentSpeed = speed;
		cancelAnimationFrame(this.animation);
		this.startAnimating();
	}

	changeSize(size) {
		this.clear();
		this.setState(
			{
				width: size,
				height: size
			},
			() => {
				this.start();
			}
		);
	}

	checkNeighbours(appData) {
		let neighbours = [];
		appData.cells.forEach((cell, i) => {
			neighbours = [];
			//get neighbors of the current cell
			if (i === 0) {
				//top left
				neighbours = [
					appData.cells[appData.arrLength - 1], //top left
					appData.cells[appData.arrLength - appData.width], //top mid
					appData.cells[appData.arrLength - appData.width + 1], //top right
					appData.cells[i + appData.width - 1], //left
					//appData.cells[i], //center
					appData.cells[i + 1], //right
					appData.cells[appData.width * 2 - 1], //bottom left
					appData.cells[i + appData.width], //bottom center
					appData.cells[i + appData.width + 1] //bottom right
				];
			} else if (i === appData.width - 1) {
				//top right
				neighbours = [
					appData.cells[appData.arrLength - 2], //top left
					appData.cells[appData.arrLength - 1], //top mid
					appData.cells[appData.arrLength - appData.width], //top right
					appData.cells[i - 1], //left
					//appData.cells[i], //center
					appData.cells[0], //right
					appData.cells[i + appData.width - 1], //bottom left
					appData.cells[i + appData.width], //bottom center
					appData.cells[appData.width] //bottom right
				];
			} else if (i === appData.arrLength - appData.width) {
				//bottom left
				neighbours = [
					appData.cells[i - 1], //top left
					appData.cells[i - appData.width], //top mid
					appData.cells[i - appData.width + 1], //top right
					appData.cells[appData.arrLength - 1], //left
					//appData.cells[i], //center
					appData.cells[i + 1], //right
					appData.cells[appData.width - 1], //bottom left
					appData.cells[0], //bottom center
					appData.cells[1] //bottom right
				];
			} else if (i === appData.arrLength - 1) {
				//bottom right
				neighbours = [
					appData.cells[appData.arrLength - appData.width - 2], //top left
					appData.cells[appData.arrLength - appData.width - 1], //top mid
					appData.cells[appData.arrLength - appData.width * 2], //top right
					appData.cells[i - 1], //left
					//appData.cells[i], //center
					appData.cells[appData.arrLength - appData.width], //right
					appData.cells[appData.width - 2], //bottom left
					appData.cells[appData.width - 1], //bottom center
					appData.cells[0] //bottom right
				];
			} else if (i > 1 && i < appData.width) {
				//top side
				neighbours = [
					appData.cells[appData.arrLength - appData.width + i - 1], //top left
					appData.cells[appData.arrLength - appData.width + i], //top mid
					appData.cells[appData.arrLength - appData.width + i + 1], //top right
					appData.cells[i - 1], //left
					//appData.cells[i], //center
					appData.cells[i + 1], //right
					appData.cells[appData.width], //bottom left
					appData.cells[i + appData.width], //bottom center
					appData.cells[i + appData.width + 1] //bottom right
				];
			} else if (
				i % 25 === 0 &&
				i !== 0 &&
				i !== appData.arrLength - appData.width
			) {
				//left side
				neighbours = [
					appData.cells[appData.arrLength - appData.width + i - 1], //top left
					appData.cells[appData.arrLength - appData.width + i], //top mid
					appData.cells[appData.arrLength - appData.width + i + 1], //top right
					appData.cells[i - 1], //left
					//appData.cells[i], //center
					appData.cells[i + 1], //right
					appData.cells[appData.width], //bottom left
					appData.cells[i + appData.width], //bottom center
					appData.cells[i + appData.width + 1] //bottom right
				];
			} else if (
				i % 25 === 24 &&
				i !== appData.width - 1 &&
				i !== appData.arrLength - 1
			) {
				//right side
				neighbours = [
					appData.cells[i - appData.width - 1], //top left
					appData.cells[i - appData.width], //top mid
					appData.cells[i - appData.width * 2 + 1], //top right
					appData.cells[i - 1], //left
					//appData.cells[i], //center
					appData.cells[i - appData.width + 1], //right
					appData.cells[i + appData.width - 1], //bottom left
					appData.cells[i + appData.width], //bottom center
					appData.cells[i + 1] //bottom right
				];
			} else if (
				i > appData.arrLength - appData.width &&
				i < appData.arrLength - 1
			) {
				//bottom side
				neighbours = [
					appData.cells[i - appData.width - 1], //top left
					appData.cells[i - appData.width], //top mid
					appData.cells[i - appData.width + 1], //top right
					appData.cells[i - 1], //left
					//appData.cells[i], //center
					appData.cells[i + 1], //right
					appData.cells[appData.width + i - appData.arrLength - 1], //bottom left
					appData.cells[appData.width + i - appData.arrLength], //bottom center
					appData.cells[appData.width + i - appData.arrLength + 1] //bottom right
				];
			} else {
				neighbours = [
					appData.cells[i - appData.width - 1], //top left
					appData.cells[i - appData.width], //top mid
					appData.cells[i - appData.width + 1], //top right
					appData.cells[i - 1], //left
					//appData.cells[i], //center
					appData.cells[i + 1], //right
					appData.cells[i + appData.width - 1], //bottom left
					appData.cells[i + appData.width], //bottom center
					appData.cells[i + appData.width + 1] //bottom right
				];
			}

			//check how many live and dead neighbors the current cell has
			let aliveNeighbours = 0;

			neighbours.forEach(neighbour => {
				if (neighbour === undefined) {
					return;
				} else {
					switch (neighbour.state) {
						case 'alive':
							aliveNeighbours++;
							break;
						case 'young':
							aliveNeighbours++;
							break;
						default:
							break;
					}
				}
			});

			//check if the appData.cells state should be changed
			if (cell.state === 'dead' && aliveNeighbours === 3) {
				appData.cells[i].state = 'young';
			} else if (
				cell.state === 'alive' &&
				(aliveNeighbours >= 4 || aliveNeighbours <= 1)
			) {
				appData.cells[i].state = 'dead';
			} else if (cell.state === 'young') {
				appData.cells[i].state = 'alive';
			}
		});
		return appData.cells;
	}
	render() {
		return (
			<div className="app">

				<h1 className="title">The Game of Life</h1>

				<Controls>
					<Button content="Start" clickHandler={this.start} />
					<Button content="Pause" clickHandler={this.pause} />
					<Button content="Clear" clickHandler={this.clear} />
				</Controls>

				<div className="generations">
					{this.state.generation}
				</div>

				<Field
					data={this.state.cells}
					width={this.state.width}
					onClick={this.checkCell}
				/>

				<Controls label="Speed:">
					<Button
						content="Slow"
						clickHandler={() => {
							this.setSpeed(this.state.speeds.slow);
						}}
					/>
					<Button
						content="Medium"
						clickHandler={() => {
							this.setSpeed(this.state.speeds.medium);
						}}
					/>
					<Button
						content="Fast"
						clickHandler={() => {
							this.setSpeed(this.state.speeds.fast);
						}}
					/>
				</Controls>

				<Controls label="Size:">
					<Button
						content="Small 15x15"
						clickHandler={() => {
							this.changeSize(15);
						}}
					/>
					<Button
						content="Medium 25x25"
						clickHandler={() => {
							this.changeSize(25);
						}}
					/>
					<Button
						content="Large 35x35"
						clickHandler={() => {
							this.changeSize(35);
						}}
					/>
				</Controls>

			</div>
		);
	}
}
export default App;
