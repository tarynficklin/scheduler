import React from 'react'
import './Schedule.css'

export default function Schedule(props) {
	const {schedule} = props
	return (
		<div className="schedule">
			<p>schedule: {JSON.stringify(schedule)}</p>
		</div>
	)
}