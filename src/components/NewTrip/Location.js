import React from 'react'
import './Location.css'

export default function Location(props) {
	const {getLocationInput} = props;
	return (
		<div className="location">
			<input onChange={(e) => getLocationInput(e.target.value)} placeholder="location"/>
		</div>
	)
}