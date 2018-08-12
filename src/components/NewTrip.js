import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import axios from 'axios';
import './NewTrip.css'

import Header   from './NewTrip/Header'
import Calendar from './NewTrip/Calendar';
import Location from './NewTrip/Location';
import Budget   from './NewTrip/Budget';

class NewTrip extends Component {

	constructor () {
		super();
		this.state = {
			trip_id         : 0,
			trip_location   : '',
			trip_start_date : '',
			trip_end_date   : '',
			trip_budget     : 0,
			day_count       : 1,
			schedule_days   : []
		}
		this.deleteTrip				 = this.deleteTrip.bind(this);
		this.getBudgetInput    = this.getBudgetInput.bind(this);
		this.getLocationInput  = this.getLocationInput.bind(this);
		this.getStartDateInput = this.getStartDateInput.bind(this);
		this.getEndDateInput   = this.getEndDateInput.bind(this);
		this.getDayCount		   = this.getDayCount.bind(this);
	}

	async componentDidMount () {
		axios.get(`/api/trips/`).then(results => this.setState({trip_id: results.data.trip_id}))
	}

	
	createTrip () {
		const {trip_id, trip_location, trip_start_date,	trip_end_date, trip_budget, day_count} = this.state;
		axios.post(`/api/trips/`, {trip_id, user_id: this.props.user.user_id, trip_location, trip_start_date, trip_end_date, trip_budget}).then(() => {
			for (let i=0; i < day_count; i++) {
				axios.post(`/api/schedule/`, {trip_id: this.state.trip_id, schedule_day: "12", schedule_month: "12", schedule_year: "2018"})
				if (i===day_count-1) {this.props.history.push(`/trip/${trip_id}`)}
			}
		})
	}

	deleteTrip () {
		const {trip_id} = this.state
		axios.delete(`api/list/purge/${trip_id}`);
		this.props.history.push('/');
	}
	
	getBudgetInput    (val) {this.setState({trip_budget: val})}
	getLocationInput  (val) {this.setState({trip_location: val})}
	getStartDateInput (val) {this.setState({trip_start_date: val})}
	getEndDateInput   (val) {this.setState({trip_end_date: val})}
	getDayCount				(val) {this.setState({day_count: val})}

	render () {
		const {deleteTrip, getBudgetInput, getLocationInput, getStartDateInput, getEndDateInput, getDayCount} = this;

		return (
			<div className="new-trip">
				<Header deleteTrip={deleteTrip}/>
				<Location getLocationInput={getLocationInput}/>
				<Calendar
					getStartDateInput={getStartDateInput}
					getEndDateInput={getEndDateInput}
					getDayCount={getDayCount}
					day_count={this.state.day_count} />
				<Budget getBudgetInput={getBudgetInput}/>
				<button onClick={() => this.createTrip()}>Done</button>
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}};
export default withRouter(connect(mapStateToProps)(NewTrip));