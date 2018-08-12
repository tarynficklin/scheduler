import React from 'react'
import './Header.css'

export default function Header(props) {
	const {deleteTrip} = props;
	return (
		<div className="header">
			<button onClick={() => deleteTrip()}>X</button>
			<p>New Vacation</p>
		</div>
	)
}