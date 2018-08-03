import React from 'react'

export default function PackingWidget(props) {
	const {packingList} = props
	return (
		<div>
			<p>packingList: {JSON.stringify(packingList)}</p>
		</div>
	)
}