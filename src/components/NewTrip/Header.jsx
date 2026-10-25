import React from 'react';
import {Link} from 'react-router';
import './Header.css';

export default function Header (props) {
	// let themeColor = () => {return {backgroundColor: `rgb(${props.color})`}};
	return (
		<div className="header">
			<Link to="/"><button className="exit-button"><i className="fas fa-times"></i></button></Link>
			<h1>New Vacation</h1>
		</div>
	);
};