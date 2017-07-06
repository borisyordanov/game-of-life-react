import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
	return (
		<button className="btn" onClick={props.clickHandler}>
			{props.content}
		</button>
	);
};

export default Button;

Button.propTypes = {
	clickHandler: PropTypes.func,
	content: PropTypes.string.isRequired
};
