import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Scheduler extends Component {
	constructor () {
		super();
		this.state = {
			trip: {
				trip_id: 0,
				trip_location: "",
				trip_start_date: 0,
				trip_end_date: 0,
				trip_budget: 0,
				trip_packing_list: {},
				trip_schedule: {}
			}
		}
	}

	componentDidMount() {
		const {id} = this.props.match.params;
		axios.get(`/api/trips/${id}`)
		.then(results => this.setState({trip: results.data[0]}));
	}

	render () {
		const {
			trip_id,
			trip_location,
			trip_start_date,
			trip_end_date,
			trip_budget,
			trip_packing_list,
			trip_schedule
		} = this.state.trip;
		return (
			<div>
				<Link to="/"><button>X</button></Link>
				<p>id: {trip_id}</p>
				<p>location: {trip_location}</p>
				<p>date: {trip_start_date} - {trip_end_date}</p>
				<p>budget: {trip_budget}</p>
				<p>packingList: {JSON.stringify(trip_packing_list)}</p>
				<p>schedule: {JSON.stringify(trip_schedule)}</p>
			</div>
		)
	}
}

export default Scheduler;