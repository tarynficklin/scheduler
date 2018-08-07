import React from 'react'
import './ListItem.css'

export default function ListItem(props) {
	const {title, price, time, checked} = props
	return (
		<div className="list-item">
			<a>{title} </a>
			<a>{price} </a>
			<a>{time}</a>
		</div>
	)
}