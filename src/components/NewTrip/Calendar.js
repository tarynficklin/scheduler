import React from 'react'
import './Calendar.css'

export default function Calendar(props) {
	const {getStartDateInput, getEndDateInput, getDayCount, day_count} = props
	return (
		<div className="calendar">
			<input onChange={(e) => getStartDateInput(e.target.value)} placeholder="start date" /><br />
			<input onChange={(e) => getEndDateInput(e.target.value)} placeholder="end date" /><br />
			<input onChange={(e) => getDayCount(e.target.value)} value={day_count} type="number" min="1"/>
		</div>
	)
}