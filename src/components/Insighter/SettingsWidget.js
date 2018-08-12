import React from 'react'
import {Link} from 'react-router-dom'
import './SettingsWidget.css'

export default function SettingsWidget(props) {
	const {location, startDate, endDate, id, deleteTrip} = props;
	const {getLocationInput, getStartDateInput, getEndDateInput, updateLocation, updateStartDate, updatEndDate} = props;
	return (
		<div className="settings-widget">
			<h3>Settings Widget</h3>
			<p>Current Location: {location}</p>
			<input value={location} onChange={(e) => getLocationInput(e.target.value)} onBlur={() => updateLocation(id)}/>
			<p>Current Date: {startDate} - {endDate}</p>
			<input value={startDate} onChange={(e) => getStartDateInput(e.target.value)} onBlur={() => updateStartDate(id)} />
			<input value={endDate} onChange={(e) => getEndDateInput(e.target.value)} onBlur={() => updatEndDate(id)} /><br />
			<Link to="/"><button onClick={() => deleteTrip(id)}>Delete Trip</button></Link>
		</div>
	)
}