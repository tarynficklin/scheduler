import React from 'react'
import {Link} from 'react-router-dom'
import './Header.css'

export default function Header(props) {
	return (
		<div className="header">
			<Link to="/"><button>X</button></Link>
			<p>New Vacation</p>
		</div>
	)
}