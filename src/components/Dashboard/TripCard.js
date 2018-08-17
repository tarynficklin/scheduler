import React from 'react';
import './TripCard.css';
import {connect} from 'react-redux'
import {updateBackground} from '../../ducks/reducer';

async function selectTrip(props) {
	const {id, background, router} = props
	await props.updateBackground(background);
	await router.push(`/trip/${id}`);
}

function TripCard(props) {
	console.log(props)
	const {location, startDate, endDate} = props;
	return (
		<frosted-glass overlay-color="#ffffff52" class="trip-card" onClick={() => selectTrip(props)}>
			<h3>{location}</h3>
			<p>{startDate} to {endDate}</p>
		</frosted-glass>
	)
}

export default connect(null, {updateBackground})(TripCard);