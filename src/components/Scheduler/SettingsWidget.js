import React from 'react'
import './SettingsWidget.css'

export default function SettingsWidget(props) {
	const {location, startDate, endDate} = props
	return (
		<div className="settings-widget">
			<h3>Settings Widget</h3>
			<p>Current Location: {location}</p>
			<input placeholder="location" />
			<p>Current Date: {startDate} - {endDate}</p>
			<input placeholder="start date" />
			<input placeholder="end date" />
			<button>Delete Trip</button>
		</div>
	)
}