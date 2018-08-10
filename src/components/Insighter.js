import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import './Insighter.css';

import Header from './Insighter/Header';
import Schedule from './Insighter/Schedule';
import BudgetWidget from './Insighter/BudgetWidget';
import PackingWidget from './Insighter/PackingWidget';
import SettingsWidget from './Insighter/SettingsWidget';

class Insighter extends Component {
	constructor () {
		super();
		this.state = {
			trip_id:           0,
			trip_location:     'Trip',
			trip_start_date:   '1/1/20XX',
			trip_end_date:     '1/1/20XX',
			trip_budget:       0,
			trip_packing_list: [],
			trip_schedule:     []
		}
		//input bindings
		this.getBudgetInput    = this.getBudgetInput.bind(this);
		this.getLocationInput  = this.getLocationInput.bind(this);
		this.getStartDateInput = this.getStartDateInput.bind(this);
		this.getEndDateInput   = this.getEndDateInput.bind(this);
		//axios bindings
		this.updateBudget    = this.updateBudget.bind(this);
		this.updateLocation  = this.updateLocation.bind(this);
		this.updateStartDate = this.updateStartDate.bind(this);
		this.updatEndDate    = this.updatEndDate.bind(this);
		//adding bindings
		this.addPackingItem	 = this.addPackingItem.bind(this);
	}

	componentDidMount() {
		const {id} = this.props.match.params;
		axios.get(`/api/trips/trip/${id}`)
		.then(results => {
			const userData = results.data[0];
			if (userData && userData.user_id === this.props.user.user_id) {
				this.setState(userData);
				axios.get(`/api/list/${id}`).then(results => this.setState({trip_packing_list: results.data}));
				axios.get(`/api/schedule/${id}`).then(results => this.setState({trip_schedule: results.data}));
			}
			else {this.props.history.push('/404')}
		})
	}

	//delete trip function
	deleteTrip (id) {axios.delete(`api/trips/${id}`)}
	//input functions
	getBudgetInput    (val) {this.setState({trip_budget: val})}
	getLocationInput  (val) {this.setState({trip_location: val})}
	getStartDateInput (val) {this.setState({trip_start_date: val})}
	getEndDateInput   (val) {this.setState({trip_end_date: val})}
	//axios functions
	updateBudget    (id) {axios.put(`/api/trips/budget/${id}`,    {budget: this.state.trip_budget})}
	updateLocation  (id) {axios.put(`/api/trips/location/${id}`,  {location: this.state.trip_location})}
	updateStartDate (id) {axios.put(`/api/trips/startDate/${id}`, {startDate: this.state.trip_start_date})}
	updatEndDate    (id) {axios.put(`/api/trips/endDate/${id}`,   {endDate: this.state.trip_end_date})}
  //add packing list item function
	addPackingItem() {
		const {trip_packing_list, trip_id} = this.state
		axios.post(`/api/list`, {trip_id, packing_title: ""}).then(results => {
			trip_packing_list.push(results.data[0]);
			this.setState({trip_packing_list});
		})
	}

	render () {
		
		const {trip_id,	trip_location, trip_start_date,	trip_end_date, trip_budget, trip_schedule, trip_packing_list} = this.state;
		const {getBudgetInput, getLocationInput, getStartDateInput, getEndDateInput} = this;
		const {updateBudget, updateLocation, updateStartDate, updatEndDate} = this;
		const {addPackingItem} = this;

		return (
			<div className="insighter">
				<Header id={trip_id} location={trip_location} />
				<Schedule schedule={trip_schedule} />
				<BudgetWidget
					id={trip_id}
					budget={trip_budget}
					getBudgetInput={getBudgetInput}
					updateBudget={updateBudget} />
				<PackingWidget packingList={trip_packing_list} addPackingItem={addPackingItem} />
				<SettingsWidget
					location={trip_location}
					startDate={trip_start_date}
					endDate={trip_end_date}
					id={trip_id}

					getLocationInput={getLocationInput}
					getStartDateInput={getStartDateInput}
					getEndDateInput={getEndDateInput}

					updateLocation={updateLocation}
					updateStartDate={updateStartDate}
					updatEndDate={updatEndDate}

					deleteTrip={this.deleteTrip} />
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}};
export default connect(mapStateToProps)(Insighter);