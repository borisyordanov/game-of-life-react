import React from 'react';
import PropTypes from 'prop-types';

const Cell = props => {
	this.mainClass = 'cell';
	return (
		<div
			className={`${this.mainClass} ${props.state}`}
			onClick={() => {
				props.onClick(props.id);
			}}
		/>
	);
};

export default Cell;

Cell.propTypes = {
	onClick: PropTypes.func,
	state: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired
};
