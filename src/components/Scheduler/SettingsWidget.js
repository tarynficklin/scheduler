import React from 'react'

export default function SettingsWidget(props) {
	const {location, startDate, endDate} = props
	return (
		<div>
			<p>location: {location}</p>
			<p>date: {startDate} - {endDate}</p>
		</div>
	)
}