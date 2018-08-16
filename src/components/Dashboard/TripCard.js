import React from 'react';
import './TripCard.css';

async function selectTrip(props) {
	const {id, background, updateBackground, router} = props
	await updateBackground(background);
	await router.push(`/trip/${id}`);
}

export default function TripCard(props) {
	console.log(props)
	const {location, startDate, endDate} = props;
	return (
		<frosted-glass overlay-color="#ffffff52" class="trip-card" onClick={() => selectTrip(props)}>
			<h3>{location}</h3>
			<p>{startDate} to {endDate}</p>
		</frosted-glass>
	)
}