import React from 'react';
import {updateBackground, updateColor} from '../../ducks/reducer';
import {connect} from 'react-redux';
import FadeIn from 'react-fade-in';
import moment from 'moment';
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
		<FadeIn>
		<frosted-glass overlay-color="rgba(255, 255, 255, 0.5)" class="trip-card" onClick={() => selectTrip(props)}>
			<div className="color-strip" style={{backgroundColor: `rgb(${color})`}}></div>
			<h1>{location}</h1>
			<a>{moment(startDate).format("MMMM DD YYYY")} - {moment(endDate).format("MMMM DD YYYY")}</a>
		</frosted-glass>
		</FadeIn>
	);
};

export default connect(null, {updateBackground, updateColor})(TripCard);