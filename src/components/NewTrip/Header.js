import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export default function Header (props) {
	return (
		<div className="header">
			<Link to="/"><button className="button" style={{backgroundColor: `rgb(${props.color})`}}>X</button></Link>
			<p>New Vacation</p>
		</div>
	);
};