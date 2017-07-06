import React from 'react';
import PropTypes from 'prop-types';

const Controls = props => {
	return (
		<div className='controls'>
			<span className='label'>{props.label}</span>
			{props.children}
		</div>
	);
};

export default Controls;

Controls.propTypes = {
	label: PropTypes.string
};
