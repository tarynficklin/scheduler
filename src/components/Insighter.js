import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {updateBackground} from '../ducks/reducer';
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
			trip_packing_list : [],
			trip_schedule     : [],
			current_schedule  : 0
		}
		//input bindings
		this.getBudgetInput    = this.getBudgetInput.bind(this);
		this.getLocationInput  = this.getLocationInput.bind(this);
		//axios bindings
		this.updateBudget    = this.updateBudget.bind(this);
		this.updateLocation  = this.updateLocation.bind(this);
		//misc bindings
		this.addPackingItem = this.addPackingItem.bind(this);
		this.scheduleIndex  = this.scheduleIndex.bind(this);
	}

	componentDidMount() {
		const {id} = this.props.match.params;
		axios.get(`/api/trips/trip/${id}`)
		.then(results => {
			const userData = results.data;
			console.log(userData)
			if (userData && userData.user_id === this.props.user.user_id) {
				this.setState(userData);
				this.props.updateBackground(this.state.trip_background);
				axios.get(`/api/list/${id}`).then(results => this.setState({trip_packing_list: results.data}));
				axios.get(`/api/schedule/${id}`).then(results => this.setState({trip_schedule: results.data, current_schedule: results.data[0].schedule_id}));
			}
			else {this.props.history.push('/404')}
		})
	}


	//misc functions
	deleteTrip    (id) {axios.delete(`api/trips/${id}`)}
	scheduleIndex (id) {this.setState({current_schedule: id})}
	//input functions
	getBudgetInput    (val) {this.setState({trip_budget: val})}
	getLocationInput  (val) {this.setState({trip_location: val})}
	//axios functions
	updateBudget    (id) {axios.put(`/api/trips/budget/${id}`,    {budget: this.state.trip_budget})}
	updateLocation  (id) {axios.put(`/api/trips/location/${id}`,  {location: this.state.trip_location})}
  //add packing list item function
	addPackingItem() {
		const {trip_packing_list, trip_id} = this.state
		axios.post(`/api/list`, {trip_id, packing_title: "New Item"}).then(results => {
			trip_packing_list.push(results.data);
			this.setState({trip_packing_list});
		})
	}

	render () {
		const {
			trip_id,
			trip_location,
			trip_start_date,
			trip_end_date,
			trip_budget,
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

		console.log(this.props)

		return (
			<div className="insighter">
				<frosted-glass overlay-color="#ffffff52" blur-amount="1.6rem" class="insighter-card">
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
				</frosted-glass>
			</div>
		)
	}
}

function mapStateToProps (state) {
	return {
		user: state.auth0.user
	}
};
export default withRouter(connect(mapStateToProps, {updateBackground})(Insighter));