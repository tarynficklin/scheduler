import React from 'react'
import './Calendar.css'

export default function Calendar(props) {
	return (
		<div className="calendar">
			<input placeholder="start date" />
			<input placeholder="end date" />
		</div>
	)
}