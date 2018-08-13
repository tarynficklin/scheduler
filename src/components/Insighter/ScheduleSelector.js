import React from 'react';
import './ScheduleSelector.css';

export default function ScheduleSelector(props) {
	const {schedule, scheduleIndex, currentSchedule} = props
	return (
		<form className="schedule-selector">
			{schedule.map((e, i) => {
				const {schedule_id, schedule_date} = e
				return (
					<div style={{display: 'inline'}} key={i}>
						<input
							type="radio"
							name="weekday"
							onChange={() => {}}
							checked={e.schedule_id === currentSchedule ? true : false}
							val={schedule_id} onClick={() => scheduleIndex(schedule_id)}
						/>
						<a>{schedule_date}</a>
					</div>
				)
			})
		}
		</form>
	)
}