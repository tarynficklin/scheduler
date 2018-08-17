import React, {Component} from 'react';
import {updateBackground} from '../ducks/reducer';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import './Insighter.css';

import Header           from './Insighter/Header';
import Schedule         from './Insighter/Schedule';
import ScheduleSelector from './Insighter/ScheduleSelector';
import BudgetWidget     from './Insighter/BudgetWidget';
import PackingWidget    from './Insighter/PackingWidget';
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
			trip_bg_color     : '',
			trip_packing_list : [],
			trip_schedule     : [],
			current_schedule  : 0
		};
		this.getBudgetInput   = this.getBudgetInput.bind(this);
		this.getLocationInput = this.getLocationInput.bind(this);
		this.updateBudget     = this.updateBudget.bind(this);
		this.updateLocation   = this.updateLocation.bind(this);
		this.addPackingItem   = this.addPackingItem.bind(this);
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
				document.getElementById("app").style.cssText = `background: center fixed url(${this.state.trip_background}); background-size: cover; min-height: 100vh; transition: 1s;`
				axios.get(`/api/list/${id}`).then(results => this.setState({trip_packing_list: results.data}));
				axios.get(`/api/schedule/${id}`).then(results => this.setState({trip_schedule: results.data, current_schedule: results.data[0].schedule_id}));
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

	async addPackingItem () {
		const {trip_packing_list, trip_id} = this.state;
		const results = await axios.post(`/api/list`, {trip_id, packing_title: "New Item"});
		await trip_packing_list.push(results.data);
		await this.setState({trip_packing_list});
	};

	render () {
		const {
			trip_id,
			trip_location,
			trip_start_date,
			trip_end_date,
			trip_budget,
			trip_bg_color,
			trip_schedule,
			trip_packing_list,
			current_schedule
		} = this.state;

		const {
			getBudgetInput,
			getLocationInput,
			scheduleIndex,
			updateLocation,
			updateBudget,
			addPackingItem,
			deleteTrip
		} = this;

		return (
			<div className="insighter">
				<frosted-glass overlay-color="#ffffff50" blur-amount="1.6rem" class="insighter-card">
					<Header
						location  = {trip_location}
						startDate = {trip_start_date}
						endDate   = {trip_end_date} />
					<ScheduleSelector
						schedule        = {trip_schedule}
						scheduleIndex   = {scheduleIndex}
						currentSchedule = {current_schedule} />
					<Schedule
						schedule        = {trip_schedule}
						currentSchedule = {current_schedule} />
					<BudgetWidget
						id             = {trip_id}
						budget         = {trip_budget}
						getBudgetInput = {getBudgetInput}
						updateBudget   = {updateBudget} />
					<PackingWidget
						packingList    = {trip_packing_list}
						addPackingItem = {addPackingItem} />
					<SettingsWidget
						id                = {trip_id}
						location          = {trip_location}
						getLocationInput  = {getLocationInput}
						updateLocation    = {updateLocation}
						deleteTrip        = {deleteTrip} />
					<div style={{height: '100px', width: '200px', backgroundColor: `rgb(${trip_bg_color})`}}></div>
				</frosted-glass>
			</div>
		);
	};
};

function mapStateToProps (state) {return {user: state.auth0.user, background: state.reducer.background}};
export default withRouter(connect(mapStateToProps, {updateBackground})(Insighter));