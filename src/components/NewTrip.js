import React, {Component} from 'react';
import {updateBackground} from '../ducks/reducer';
import {withRouter} from 'react-router-dom';
import * as Vibrant from 'node-vibrant';
import {connect} from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import './NewTrip.css';

import Header   from './NewTrip/Header';
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
			trip_budget     : 0,
		};
		this.getBudgetInput    = this.getBudgetInput.bind(this);
		this.getLocationInput  = this.getLocationInput.bind(this);
		this.getStartDateInput = this.getStartDateInput.bind(this);
		this.getEndDateInput   = this.getEndDateInput.bind(this);
		this.getDayCount		   = this.getDayCount.bind(this);
		this.captureColor      = this.captureColor.bind(this);
	};

	componentDidMount () {axios.get(`/api/trips/`).then(results => this.setState({trip_id: results.data.trip_id}))};

	async createTrip () {
		const {REACT_APP_UAK} = process.env;
		const {updateBackground} = this.props;
		const {trip_id, trip_location, trip_start_date,	trip_end_date, trip_budget} = this.state;

		let days = this.getDaysBetween(trip_start_date, trip_end_date);

		const photo = await axios.get(`https://api.unsplash.com/search/photos/?page=1&per_page=10&query=${trip_location}&client_id=${REACT_APP_UAK}`);
		const colors = await Vibrant.from(`${photo.data.results[0].urls.raw}&client_id=${process.env.REACT_APP_UAK}`)
		.getPalette((err, palette) => palette);
		const swatch = colors.Vibrant._rgb;
		const trip_bg_color = `rgb(${swatch[0]}, ${swatch[1]}, ${swatch[2]})`;
		await axios
			.post(`/api/trips/`, {
				trip_id					: trip_id,
				user_id					: this.props.user.user_id,
				trip_location 	: trip_location,
				trip_start_date	: trip_start_date,
				trip_end_date		: trip_end_date,
				trip_budget     : trip_budget,
				trip_background : `${photo.data.results[0].urls.raw}&auto=format&fit=crop&w=1400&q=80}`,
				trip_bg_color   : trip_bg_color
			});
		await updateBackground(`${photo.data.results[0].urls.raw}&auto=format&fit=crop&w=1400&q=80`);
		document.getElementById("app").style.cssText = `background: center fixed url(${photo.data.results[0].urls.raw}); background-size: cover; min-height: 100vh; transition: 1s;`

		for (let i in days) {
			await axios.post(`/api/schedule/`, {trip_id: this.state.trip_id, schedule_date: days[i]});
			if (i*1===days.length-1) {this.props.history.push(`/trip/${trip_id}`)};
		};

	};

	captureColor (image) {
    Vibrant.from(`${image}&client_id=${process.env.REACT_APP_UAK}`)
    .getPalette((err, palette) => {
			let colors = `rgb(${palette.Vibrant._rgb[0]}, ${palette.Vibrant._rgb[1]}, ${palette.Vibrant._rgb[2]})`;
			this.setState({trip_bg_color: colors})
		});
  };

	getDaysBetween (startDate, endDate) {
		let dates = [], days = [];
		let firstDay = moment(startDate).startOf('day').subtract(1, 'day');
		let lastDay  = moment(endDate).startOf('day').add(1, 'day');
		while (firstDay.add(1, 'days').diff(lastDay ) < 0) {dates.push(firstDay.clone().toDate())};
		for   (let i in dates) {days.push(moment(dates[i]).format("MMMM Do YYYY"))};
		return days;
	};
	
	getBudgetInput    (val) {this.setState({trip_budget: val})};
	getLocationInput  (val) {this.setState({trip_location: val})};
	getStartDateInput (val) {this.setState({trip_start_date: val})};
	getEndDateInput   (val) {this.setState({trip_end_date: val})};
	getDayCount				(val) {this.setState({day_count: val})};

	render () {
		const {
			getBudgetInput,
			getLocationInput,
			getStartDateInput,
			getEndDateInput,
			getDayCount
		} = this;

		return (
			<div className="new-trip">
				<frosted-glass overlay-color="#ffffff50" blur-amount="1.6rem" class="new-trip-card">
					<Header />
					<Location getLocationInput={getLocationInput} />
					<Calendar
						getStartDateInput={getStartDateInput}
						getEndDateInput={getEndDateInput}
						getDayCount={getDayCount} />
					<Budget getBudgetInput={getBudgetInput} />
					<button onClick={() => this.createTrip()}>Done</button>
				</frosted-glass>
			</div>
		);
	};
};

function mapStateToProps (state) {return {user: state.auth0.user}};
export default withRouter(connect(mapStateToProps, {updateBackground})(NewTrip));