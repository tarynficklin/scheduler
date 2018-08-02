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

	render () {
		const {tripCards} = this.state;
		return (
			<div>
				<UserButton />
				{tripCards.map((e, i) => {
					return (
						<TripCard
							key={i}
						/>
					)
				})
				}
			</div>
		)
	}
}

export default Dashboard;