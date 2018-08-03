import React from 'react'
import './PackingWidget.css'

export default function PackingWidget(props) {
	const {packingList} = props
	return (
		<div className="packing-widget">
			<h3>Packing List Widget</h3>
			<p>packingList: {JSON.stringify(packingList)}</p>
		</div>
	)
}