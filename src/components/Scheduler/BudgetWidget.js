import React from 'react'

export default function BudgetWidget(props) {
	const {budget} = props
	return (
		<div>
			<p>budget: {budget}</p>
		</div>
	)
}