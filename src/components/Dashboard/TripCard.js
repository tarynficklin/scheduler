import React from 'react';
import {Link} from 'react-router-dom'
import './TripCard.css';

export default function TripCard(props) {
	const {id, location, startDate, endDate, deleteTrip} = props;
	return (
		
			<div className="trip-card">
				<button onClick={() => deleteTrip(id)}>X</button>
				<p>location: {location}</p>
				<p>date: {startDate} - {endDate}</p>
				<Link to={`/trip/${id}`}><button>Edit</button></Link>
			</div>
	)
}