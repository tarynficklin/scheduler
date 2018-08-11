import React from 'react'
import './BudgetWidget.css'

export default function BudgetWidget(props) {
	const {id, budget, getBudgetInput, updateBudget} = props
	return (
		<div className="budget-widget">
			<h3>Budget Widget</h3>
			<p>Current Budget: {budget}</p>
			<input onChange={(e) => getBudgetInput(e.target.value)} onBlur={() => updateBudget(id)} value={budget} type='number' min='0'/>
		</div>
	)
}