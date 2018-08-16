import React from 'react';
import {Link} from 'react-router-dom'
import './TripCard.css';

export default function TripCard(props) {
	const {id, location, startDate, endDate} = props;
	return (
			<Link to={`/trip/${id}`} className="trip-card">
				<frosted-glass overlay-color="#ffffff52" style={{display: `flex`, width: `100%`, height: `100px`}}>
				</frosted-glass>
				<h3>{location}</h3>
				<p>{startDate} to {endDate}</p>
			</Link>
	)
}