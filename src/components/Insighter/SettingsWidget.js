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
				<frosted-glass overlay-color="#ffffff70" blur-amount="1.6rem" class="widget-card">
				<div>
					<input placeholder={location} onChange={(e) => getLocationInput(e.target.value)} onBlur={() => updateLocation(id)}/>
					<div className="delete-button-wrapper" style={themeColor()}>
						{!confirmDelete ? <button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})} className="delete-button"><i class="fas fa-trash-alt"></i>  Delete Trip</button> : null}
					</div>
					{confirmDelete ? 
						<div className="delete-wrapper" style={themeColor()}>
							<button onClick={() => this.setState({confirmDelete: !this.state.confirmDelete})} className="confirm-button no">No</button>
							<Link to="/"><button onClick={() => deleteTrip(id)} className="confirm-button yes">Yes</button></Link>
							<p>Are you sure you want to delete this trip?</p>
						</div> : null
					}
				</div>
				</frosted-glass> : null }
				{revealed ? <div class="arrow" style={{borderTop: `10px solid rgb(${this.props.color})`}}></div> : null}
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-cog"></i></button>
			</div>
		);
	};
};

export default SettingsWidget;