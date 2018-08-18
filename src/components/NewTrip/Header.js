import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export default function Header (props) {
	let themeColor = () => {return {backgroundColor: `rgb(${props.color})`}};
	return (
		<div className="header">
			<Link to="/"><button className="button" style={themeColor()}>X</button></Link>
			<p>New Vacation</p>
		</div>
	);
};