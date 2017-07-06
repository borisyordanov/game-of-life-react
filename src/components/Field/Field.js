import React from 'react';
import PropTypes from 'prop-types';
import Cell from '../../components/Cell/Cell';

const Field = props => {
	this.mainClass = 'field';
	return (
		<div
			className={(() => {
				switch (props.width) {
					case 15:
						return `${this.mainClass} small`;
					case 25:
						return `${this.mainClass} medium`;
					case 35:
						return `${this.mainClass} large`;
					default:
						return `${this.mainClass} medium`;
				}
			})()}
		>
			{props.data.map(card => <Cell onClick={props.onClick} {...card} />)}
		</div>
	);
};

export default Field;

Field.propTypes = {
	onClick: PropTypes.func,
	label: PropTypes.number
};
