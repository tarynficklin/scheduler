import React from 'react';
import {Link} from 'react-router-dom';

export default function Info(props) {
	const {id, location} = props
	return (
		<div>
			<Link to="/"><button>X</button></Link>
			<h1>{location}</h1>
			<p>id: {id}</p>
		</div>
	)
}