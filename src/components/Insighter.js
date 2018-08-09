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
			trip_id: 0,
			trip_location: "Trip",
			trip_start_date: 0,
			trip_end_date: 0,
			trip_budget: 0,
			trip_packing_list: [],
			trip_schedule: []
		}
		this.getBudgetInput = this.getBudgetInput.bind(this);
		this.updateBudget = this.updateBudget.bind(this);
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

	deleteTrip (id) {axios.delete(`api/trips/${id}`)}
	getBudgetInput (val) {this.setState({trip_budget: val})}
	updateBudget (id) {axios.put(`/api/trips/budget/${id}`, {budget: this.state.trip_budget})}

	render () {
		
		const {trip_id,	trip_location, trip_start_date,	trip_end_date, trip_budget, trip_schedule, trip_packing_list} = this.state;
		const {getBudgetInput, updateBudget} = this;

		console.log(this.state)
		return (
			<div className="insighter">
				<Header id={trip_id} location={trip_location} />
				<Schedule schedule={trip_schedule}/>
				<BudgetWidget
					id={trip_id}
					budget={trip_budget}
					getBudgetInput={getBudgetInput}
					updateBudget={updateBudget} />
				<PackingWidget packingList={trip_packing_list}/>
				<SettingsWidget
					location={trip_location}
					startDate={trip_start_date}
					endDate={trip_end_date}
					id={trip_id}
					deleteTrip={this.deleteTrip} />
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}};
export default connect(mapStateToProps)(Insighter);