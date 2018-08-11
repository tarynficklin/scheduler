import React from 'react'
import './Calendar.css'

export default function Calendar(props) {
	const {getStartDateInput, getEndDateInput, getDayCount} = props
	return (
		<div className="calendar">
			<input onChange={(e) => getStartDateInput(e.target.value)} placeholder="start date" />
			<input onChange={(e) => getEndDateInput(e.target.value)} placeholder="end date" />
			<input onChange={(e) => getDayCount(e.target.value)} placeholder="days" type="number" min="0"/>
		</div>
	)
}