import React from 'react'
import './Calendar.css'

export default function Calendar(props) {
	const {getStartDateInput, getEndDateInput} = props
	return (
		<div className="calendar">
			<input onChange={(e) => getStartDateInput(e.target.value)} type="date" placeholder="start date" /><br />
			<input onChange={(e) => getEndDateInput(e.target.value)} type="date" placeholder="end date" /><br />
		</div>
	)
}