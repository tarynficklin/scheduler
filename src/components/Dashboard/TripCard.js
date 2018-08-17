import React from 'react';
import {updateBackground} from '../../ducks/reducer';
import {connect} from 'react-redux'
import './TripCard.css';

async function selectTrip(props) {
	const {id, background, router} = props;
	await props.updateBackground(background);
	document.getElementById("app").style.cssText = `background: center fixed url(${background}); background-size: cover; min-height: 100vh; transition: 1s;`
	await router.push(`/trip/${id}`);
}

function TripCard (props) {
	const {location, startDate, endDate} = props;
	return (
		<frosted-glass overlay-color="#ffffff52" class="trip-card" onClick={() => selectTrip(props)}>
			<h3>{location}</h3>
			<p>{startDate} to {endDate}</p>
		</frosted-glass>
	);
};

export default connect(null, {updateBackground})(TripCard);