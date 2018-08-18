import React from 'react';
import {updateBackground, updateColor} from '../../ducks/reducer';
import {connect} from 'react-redux'
import './TripCard.css';

async function selectTrip(props) {
	const {id, background, color, router} = props;
	await props.updateBackground(background);
	await props.updateColor(color);
	document.getElementById("app").style.cssText = `background: center fixed url(${background}); background-size: cover; min-height: 100vh; transition: 1s;`
	await router.push(`/trip/${id}`);
}

function TripCard (props) {
	const {location, startDate, endDate, color} = props;
	return (
		<frosted-glass overlay-color="#ffffff50" class="trip-card" onClick={() => selectTrip(props)}>
			<div className="color-strip" style={{backgroundColor: `rgb(${color})`}}></div>
			<h3>{location}</h3>
			<p>{startDate} to {endDate}</p>
		</frosted-glass>
	);
};

export default connect(null, {updateBackground, updateColor})(TripCard);