import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './SettingsWidget.css';

class SettingsWidget extends Component {
	constructor () {
		super ();
		this.state = {
			revealed      : false,
			confirmDelete : false
		};
	};

	revealWidget () {this.setState({revealed: !this.state.revealed})};

	render () {
		const {
			id,
			location,
			deleteTrip,
			getLocationInput,
			updateLocation,
		} = this.props;
		const {revealed, confirmDelete} = this.state;
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};

		return (
			<div className="settings-widget" style={{display: 'inline'}}>
				<button onClick={() => this.revealWidget()} style={themeColor()}>Settings</button>
				{
				revealed ? 
				<div>
					<h3>Settings Widget</h3>
					<input placeholder={location} onChange={(e) => getLocationInput(e.target.value)} onBlur={() => updateLocation(id)}/><br /><br />
					<button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})} style={themeColor()}>Delete Trip</button>
					{confirmDelete ? 
						<div>
							<p>Are you sure you want to delete this trip?</p>
							<Link to="/"><button onClick={() => deleteTrip(id)} style={themeColor()}>Yes</button></Link>
							<button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})} style={themeColor()}>No</button>
						</div> : null
					}
				</div> : null }
			</div>
		);
	};
};

export default SettingsWidget;