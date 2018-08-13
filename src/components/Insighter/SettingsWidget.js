import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './SettingsWidget.css'

class SettingsWidget extends Component {
	constructor () {
		super ();
		this.state = {
			confirmDelete : false
		}
	}
	render () {
		const {confirmDelete} = this.state;
		const {
			id,
			location,
			startDate,
			endDate,
			deleteTrip,
			getLocationInput,
			getStartDateInput,
			getEndDateInput,
			updateLocation,
			updateStartDate,
			updateEndDate
		} = this.props;
		return (
			<div className="settings-widget">
				<h3>Settings Widget</h3>
				<p>Current Location: {location}</p>
				<input value={location} onChange={(e) => getLocationInput(e.target.value)} onBlur={() => updateLocation(id)}/>
				<p>Current Date: {startDate} - {endDate}</p>
				<input value={startDate} onChange={(e) => getStartDateInput(e.target.value)} onBlur={() => updateStartDate(id)} />
				<input value={endDate} onChange={(e) => getEndDateInput(e.target.value)} onBlur={() => updateEndDate(id)} /><br /><br />
				<button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})}>Delete Trip</button>
				{confirmDelete ? 
						<div>
							<p>Are you sure you want to delete this trip?</p>
							<Link to="/"><button onClick={() => deleteTrip(id)}>Yes</button></Link>
							<button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})}>No</button>
						</div> : null}
			</div>
		)
	}
}

export default SettingsWidget