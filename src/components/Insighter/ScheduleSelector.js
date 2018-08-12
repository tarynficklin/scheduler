import React from 'react';
import './Schedule.css';

export default function ScheduleSelector(props) {
	const {schedule, scheduleIndex} = props
	return (
		<div className="schedule">
			{schedule.map((e, i) => {
				return (
					<button key={i} onClick={() => scheduleIndex(e.schedule_id)}>{e.schedule_id}</button>
				)
			})
		}
		</div>
	)
}