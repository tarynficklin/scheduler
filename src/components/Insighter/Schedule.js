import React from 'react';
import ScheduleList from './ScheduleList';
import './Schedule.css';

export default function Schedule (props) {
	const {schedule, currentSchedule} = props;
	return (
		<div className="schedule">
			{schedule.map((e, i) => {
				return (
					<ScheduleList
						key={i}
						id={e.schedule_id}
						date={e.schedule_date}
						currentSchedule={currentSchedule}
						color={props.color}
					/>
				)
			})}
		</div>
	);
};