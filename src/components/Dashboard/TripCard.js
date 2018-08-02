import React from 'react';
import './TripCard.css';

export default function TripCard(props) {
	const {id, location, startDate, endDate, budget, packingList, schedule, deleteTrip} = props;
	return (
		<div className="trip-card">
			<button onClick={() => deleteTrip(id)}>X</button>
			<p>id: {id}</p>
			<p>location: {location}</p>
			<p>date: {startDate}-{endDate}</p>
			<p>budget: {budget}</p>
			<p>packingList: {JSON.stringify(packingList)}</p>
			<p>schedule: {JSON.stringify(schedule)}</p>
		</div>
	)
}