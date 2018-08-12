import React from 'react';
import './Schedule.css';

export default function ScheduleSelector(props) {
	const {schedule, scheduleIndex, currentSchedule} = props
	return (
		<form className="week-timeline">
			{schedule.map((e, i) => {
				return (
					<div style={{display: 'inline'}} key={i}>
						<a>{e.schedule_id}</a>
						<input
							type="radio"
							name="weekday"
							onChange={() => {}}
							checked={e.schedule_id === currentSchedule ? true : false}
							val={e.schedule_id} onClick={() => scheduleIndex(e.schedule_id)}
						/>
					</div>
				)
			})
		}
		</form>
	)
}