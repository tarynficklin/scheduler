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
			<div className="settings-widget widget">
				{
				revealed ? 
				<frosted-glass overlay-color="#ffffff50" blur-amount="1.6rem" class="widget-card">
				<div>
					<h3>Settings</h3>
					<input placeholder={location} onChange={(e) => getLocationInput(e.target.value)} onBlur={() => updateLocation(id)}/><br /><br />
					<button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})} style={themeColor()} className="delete-button"><i class="fas fa-trash-alt"></i> Delete Trip</button>
					{confirmDelete ? 
						<div>
							<p>Are you sure you want to delete this trip?</p>
							<Link to="/"><button onClick={() => deleteTrip(id)} style={themeColor()}>Yes<i class="fas fa-check"></i></button></Link>
							<button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})} style={themeColor()}>No<i class="fas fa-times"></i></button>
						</div> : null
					}
				</div>
				</frosted-glass> : null }
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-cog"></i></button>
			</div>
		);
	};
};

export default SettingsWidget;