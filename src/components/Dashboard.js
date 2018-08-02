import React, {Component} from 'react';
import UserButton from './Dashboard/UserButton';
import TripCard from './Dashboard/TripCard';
import axios from 'axios';

class Dashboard extends Component {
	constructor () {
		super();
		this.state = {
			tripCards: []
		}
	}

	componentDidMount() {axios.get('/api/trips').then(results => this.setState({tripCards: results.data}))}
	componentDidUpdate() {axios.get('/api/trips').then(results => this.setState({tripCards: results.data}))}

	deleteTrip(id) {axios.delete(`api/trips/${id}`)}

	render () {
		const {tripCards} = this.state;
		return (
			<div>
				<UserButton />
				{tripCards.map((e, i) => {
					return (
						<TripCard
							key={i}
							id={e.trip_id}
							location={e.trip_location}
							startDate={e.trip_start_date}
							endDate={e.trip_end_date}
							budget={e.trip_budget}
							packingList={e.trip_packing_list}
							schedule={e.trip_schedule}
							deleteTrip={this.deleteTrip}
						/>
					)
				})
				}
			</div>
		)
	}
}

export default Dashboard;