import React from 'react';
import './TripCard.css';

export default function TripCard(props) {
	return (
		<div className="trip-card">
			<button>X</button>
			<p>id:</p>
			<p>title:</p>
			<p>date:</p>
			<p>user id:</p>
		</div>
	)
}