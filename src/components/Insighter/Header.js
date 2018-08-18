import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export default function Info (props) {
	const {location, startDate, endDate} = props;
	let themeColor = () => {return {backgroundColor: `rgb(${props.color})`}};
	return (
		<div className="header">
			<Link to="/"><button style={themeColor()}>X</button></Link>
			<h1>{location}</h1>
			<a>{startDate} to {endDate}</a>
		</div>
	);
};