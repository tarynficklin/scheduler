import React from 'react';
import ScheduleDay from './ScheduleDay';
import './Schedule.css';

export default function Schedule(props) {
	const {schedule} = props
	return (
		<div className="schedule">
			{schedule.map((e, i) => {
				return (
					<ScheduleDay
						key={i}
						id={e.schedule_id}
						day={e.schedule_day}
						month={e.schedule_month}
						year={e.schedule_year}
					/>
				)
			})
		}
		</div>
	)
}