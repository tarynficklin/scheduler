import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export default function Info (props) {
	const {location} = props;
	// let themeColor = () => {return {backgroundColor: `rgb(${props.color})`}};
	return (
		<div className="header">
			<Link to="/"><button className="exit-button"><i class="fas fa-times"></i></button></Link>
			<h1>{location}</h1>
		</div>
	);
};