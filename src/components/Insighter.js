import React, {Component} from 'react';
import {updateBackground, updateColor} from '../ducks/reducer';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import './Insighter.css';

import Header           from './Insighter/Header';
import Schedule         from './Insighter/Schedule';
import ScheduleSelector from './Insighter/ScheduleSelector';
import BudgetWidget     from './Insighter/BudgetWidget';
import PackingWidget    from './Insighter/PackingWidget';
import DonateWidget			from './Insighter/DonateWidget';
import SettingsWidget   from './Insighter/SettingsWidget';

class Insighter extends Component {
	constructor () {
		super();
		this.state = {
			trip_id           : 0,
			trip_location     : 'Trip',
			trip_start_date   : '1/1/20XX',
			trip_end_date     : '1/1/20XX',
			trip_budget       : 0,
			trip_background   : '',
			trip_bg_color     : '155, 155, 155',
			trip_schedule     : [],
			current_schedule  : 0
		};
		this.getBudgetInput   = this.getBudgetInput.bind(this);
		this.getLocationInput = this.getLocationInput.bind(this);
		this.updateBudget     = this.updateBudget.bind(this);
		this.updateLocation   = this.updateLocation.bind(this);
		this.scheduleIndex    = this.scheduleIndex.bind(this);
	}

	componentDidMount () {
		const {id} = this.props.match.params;
		axios.get(`/api/trips/trip/${id}`)
		.then(results => {
			const tripData = results.data;
			if (tripData && tripData.user_id === this.props.user.user_id) {
				this.setState(tripData);
				this.props.updateBackground(this.state.trip_background);
				this.props.updateColor(this.state.trip_bg_color);
				document.getElementById("app").style.cssText = `background: center fixed url(${this.state.trip_background}); background-size: cover; min-height: 100vh; transition: 1s;`
				axios.get(`/api/list/${id}`).then(results => this.setState({trip_packing_list: results.data}));
			}
			else {this.props.history.push('/404')};
		})
	}

	getBudgetInput   (val) {this.setState({trip_budget: val})};
	getLocationInput (val) {this.setState({trip_location: val})};
	updateBudget   (id) {axios.put(`/api/trips/budget/${id}`,   {budget: this.state.trip_budget})};
	updateLocation (id) {axios.put(`/api/trips/location/${id}`, {location: this.state.trip_location})};
	scheduleIndex  (id) {this.setState({current_schedule: id})};
	deleteTrip     (id) {axios.delete(`api/trips/${id}`)};

	render () {
		const {
			trip_id,
			trip_location,
			trip_start_date,
			trip_end_date,
			trip_budget,
			trip_bg_color,
			trip_schedule,
			current_schedule
		} = this.state;

		const {
			getBudgetInput,
			getLocationInput,
			scheduleIndex,
			updateLocation,
			updateBudget,
			deleteTrip
		} = this;
		
		return (
			<div className="insighter">
				<frosted-glass overlay-color="#ffffff50" blur-amount="1.6rem" class="insighter-card">
					<Header
						location  = {trip_location}
						startDate = {trip_start_date}
						endDate   = {trip_end_date}
						color     = {trip_bg_color} />
					<ScheduleSelector
						schedule        = {trip_schedule}
						scheduleIndex   = {scheduleIndex}
						currentSchedule = {current_schedule}
						color           = {trip_bg_color} />
					<Schedule
						schedule        = {trip_schedule}
						currentSchedule = {current_schedule}
						color           = {trip_bg_color} />
				</frosted-glass>
				<div className="widget-wrapper">
					<BudgetWidget
							id             = {trip_id}
							budget         = {trip_budget}
							getBudgetInput = {getBudgetInput}
							updateBudget   = {updateBudget}
							color          = {trip_bg_color} />
						<PackingWidget
							id             = {trip_id}
							color          = {trip_bg_color} />
						<DonateWidget
							color          = {trip_bg_color} />
						<SettingsWidget
							id                = {trip_id}
							location          = {trip_location}
							getLocationInput  = {getLocationInput}
							updateLocation    = {updateLocation}
							deleteTrip        = {deleteTrip}
							color             = {trip_bg_color} />
					</div>
			</div>
		);
	};
};

function mapStateToProps (state) {return {user: state.auth0.user, background: state.reducer.background}};
export default withRouter(connect(mapStateToProps, {updateBackground, updateColor})(Insighter));