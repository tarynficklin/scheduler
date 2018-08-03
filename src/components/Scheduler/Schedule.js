import React from 'react'

export default function Schedule(props) {
	const {schedule} = props
	return (
		<div>
			<p>schedule: {JSON.stringify(schedule)}</p>
		</div>
	)
}