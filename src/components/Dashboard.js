import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout'
import {withRouter} from 'react-router-dom';
import {onToken} from '../ducks/stripe';
import {connect} from 'react-redux';
import axios from 'axios';

import UserButton from './Dashboard/UserButton';
import TripCard from './Dashboard/TripCard';
import './Dashboard.css';

require ('dotenv').config();

class Dashboard extends Component {
	constructor () {super(); this.state = {tripCards: []}};

	componentDidMount () {axios.get(`/api/trips/${this.props.user.user_id}`).then(results => this.setState({tripCards: results.data}))};
	componentWillReceiveProps (props) {axios.get(`/api/trips/${props.user.user_id}`).then(results => this.setState({tripCards: results.data}))};

	render () {
		const {tripCards} = this.state;
		return (
			<div className="dashboard">
				<UserButton id={this.props.user.user_id} />
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
							background={e.trip_background}
							deleteTrip={this.deleteTrip}
							router={this.props.history}
						/>
					)
				})
			}
			  <StripeCheckout	token={onToken}	stripeKey={process.env.REACT_APP_STRIPE_PUBLIC}	amount={500} />
			</div>
		);
	};
};

function mapStateToProps (state) {return {user: state.auth0.user}}
export default withRouter(connect(mapStateToProps)(Dashboard));