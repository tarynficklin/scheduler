import React from 'react';
import {Link} from 'react-router-dom'
import './TripCard.css';

export default function TripCard(props) {
	const {id, location, startDate, endDate} = props;
	return (
		
		<div className="trip-card">
			<Link to={`/trip/${id}`}>
				<h3>{location}</h3>
				<p>{startDate} - {endDate}</p>
			</Link>
			</div>
	)
}