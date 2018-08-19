import React from 'react';
import './ScheduleSelector.css';

export default function ScheduleSelector (props) {
	const {schedule, scheduleIndex, currentSchedule} = props
	let themeColor = () => {return {backgroundColor: `rgb(${props.color})`}};
	return (
		<form className="schedule-selector">
			{schedule.map((e, i) => {
				const {schedule_id, schedule_date} = e
				return (
					<div style={{display: 'inline'}} key={i}>
						{e.schedule_id === currentSchedule ?
							// <div onClick={() => scheduleIndex(schedule_id)} className="radio-button selected" style={themeColor()}><i class="fas fa-circle"></i></div>
							<div className="date selected" onClick={() => scheduleIndex(schedule_id)} style={themeColor()}>
								<a className="month">{schedule_date.split(' ')[0]}</a>
								<a className="day">{schedule_date.split(' ')[1]}</a>
							</div>
							:
							// <div onClick={() => scheduleIndex(schedule_id)} className="radio-button unselected"></div>
								<div className="date unselected" onClick={() => scheduleIndex(schedule_id)}>
									<a className="month">{schedule_date.split(' ')[0]}</a>
									<a className="day">{schedule_date.split(' ')[1]}</a>
								</div>
						}
					</div>
				)
			})}
		</form>
	);
};