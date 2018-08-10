import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import './Creator.css'

import Header from './Creator/Header'
import Calendar from './Creator/Calendar';
import Location from './Creator/Location';
import Budget from './Creator/Budget';
import Packing from './Creator/Packing';

class Creator extends Component {

	constructor () {
		super();
		this.state = {
			trip_id: 0,
			trip_location: '',
			trip_start_date: '',
			trip_end_date: '',
			trip_budget: 0,
			trip_packing_list: []
		}
		this.deleteTrip				 = this.deleteTrip.bind(this);
		this.getBudgetInput    = this.getBudgetInput.bind(this);
		this.getLocationInput  = this.getLocationInput.bind(this);
		this.getStartDateInput = this.getStartDateInput.bind(this);
		this.getEndDateInput   = this.getEndDateInput.bind(this);
	}

	async componentDidMount () {
		axios.post('/api/trips', {user_id: this.props.user.user_id, trip_location: null, trip_start_date: null,	trip_end_date: null, trip_budget: null}).then(
			axios.get((`/api/trips/`)).then(results => {this.setState({trip_id: results.data[0].max})})
		)
	}

	createTrip () {
		const {trip_id, trip_location, trip_start_date,	trip_end_date, trip_budget} = this.state;
		axios.put(`/api/trips/${trip_id}`, {trip_location, trip_start_date, trip_end_date, trip_budget})
		this.props.history.push(`/trip/${trip_id}`)
	}

	deleteTrip () {
		axios.delete(`api/trips/${this.state.trip_id}`);
		console.log(this.state.trip_id)
		this.props.history.push('/');
	}

	getBudgetInput    (val) {this.setState({trip_budget: val})}
	getLocationInput  (val) {this.setState({trip_location: val})}
	getStartDateInput (val) {this.setState({trip_start_date: val})}
	getEndDateInput   (val) {this.setState({trip_end_date: val})}

	render () {
		const {trip_id} = this.state
		const {deleteTrip, getBudgetInput, getLocationInput, getStartDateInput, getEndDateInput} = this
		return (
			<div className="creator">
				<Header deleteTrip={deleteTrip}/>
				<a>new trip id: {this.state.trip_id}</a>
				<Location getLocationInput={getLocationInput}/>
				<Calendar getStartDateInput={getStartDateInput} getEndDateInput={getEndDateInput}/>
				<Budget getBudgetInput={getBudgetInput}/>
				<Packing id={trip_id}/>
				<button onClick={() => this.createTrip()}>Done</button>
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}};
export default connect(mapStateToProps)(Creator);