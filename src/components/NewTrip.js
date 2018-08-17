import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import {updateBackground} from '../ducks/reducer';
import './NewTrip.css'

import Header   from './NewTrip/Header'
import Calendar from './NewTrip/Calendar';
import Location from './NewTrip/Location';
import Budget   from './NewTrip/Budget';

require ('dotenv').config();

class NewTrip extends Component {

	constructor () {
		super();
		this.state = {
			trip_id         : 0,
			trip_location   : '',
			trip_start_date : '',
			trip_end_date   : '',
			trip_budget     : 0
		}
		this.deleteTrip				 = this.deleteTrip.bind(this);
		this.getBudgetInput    = this.getBudgetInput.bind(this);
		this.getLocationInput  = this.getLocationInput.bind(this);
		this.getStartDateInput = this.getStartDateInput.bind(this);
		this.getEndDateInput   = this.getEndDateInput.bind(this);
		this.getDayCount		   = this.getDayCount.bind(this);
	}

	componentDidMount () {axios.get(`/api/trips/`).then(results => this.setState({trip_id: results.data.trip_id}))}

	async createTrip () {
		const {REACT_APP_UAK} = process.env;
		const {updateBackground} = this.props;
		const {trip_id, trip_location, trip_start_date,	trip_end_date, trip_budget} = this.state;

		let days = this.getDaysBetween(trip_start_date, trip_end_date)

		const photo = await axios.get(`https://api.unsplash.com/search/photos/?page=1&per_page=10&query=${trip_location}&client_id=${REACT_APP_UAK}`)
		await axios.post(`/api/trips/`, {trip_id, user_id: this.props.user.user_id, trip_location, trip_start_date, trip_end_date, trip_budget, trip_background: `${photo.data.results[0].urls.raw}&auto=format&fit=crop&w=1400&q=80`})
		await updateBackground(`${photo.data.results[0].urls.raw}&auto=format&fit=crop&w=1400&q=80`) 
		
		for (let i in days) {
			await axios.post(`/api/schedule/`, {trip_id: this.state.trip_id, schedule_date: days[i]})
			if (i*1===days.length-1) {this.props.history.push(`/trip/${trip_id}`)}
		}

	}

	deleteTrip () {
		const {trip_id} = this.state
		axios.delete(`api/list/purge/${trip_id}`);
		this.props.history.push('/');
	}

	getDaysBetween (startDate, endDate) {
		let dates = [], days = []
		let firstDay = moment(startDate).startOf('day').subtract(1, 'day');
		let lastDay  = moment(endDate).startOf('day').add(1, 'day');
		while (firstDay.add(1, 'days').diff(lastDay ) < 0) {dates.push(firstDay.clone().toDate())}
		for   (let i in dates) {days.push(moment(dates[i]).format("MMMM Do YYYY"))}
		return days;
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
				<frosted-glass overlay-color="#ffffff52" blur-amount="1.6rem" class="new-trip-card">
					<Header deleteTrip={deleteTrip}/>
					<a>id: {this.state.trip_id}</a>
					<Location getLocationInput={getLocationInput}/>
					<Calendar
						getStartDateInput={getStartDateInput}
						getEndDateInput={getEndDateInput}
						getDayCount={getDayCount} />
					<Budget getBudgetInput={getBudgetInput}/>
					<button onClick={() => this.createTrip()}>Done</button>
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
export default withRouter(connect(mapStateToProps, {updateBackground})(NewTrip));