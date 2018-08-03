import React from 'react'
import './BudgetWidget.css'

export default function BudgetWidget(props) {
	const {budget} = props
	return (
		<div className="budget-widget">
			<h3>Budget Widget</h3>
			<p>Current Budget: {budget}</p>
			<input placeholder="budget" />
		</div>
	)
}