import React from 'react';
import './Budget.css';

export default function Budget (props) {
	const {getBudgetInput} = props;
	// let themeColor = () => {return {backgroundColor: `rgb(${props.color})`}};
	return (
		<div className="budget">
			<input onChange={(e) => getBudgetInput(e.target.value)} placeholder='budget' type='number' min='0'/>
		</div>
	);
};