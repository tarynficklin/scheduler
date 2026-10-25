import React from 'react';
import './ScheduleSelector.css';

export default function ScheduleSelector(props) {
  const { schedule, scheduleIndex, currentSchedule } = props;
  const themeColor = { backgroundColor: `rgb(${props.color})` };
  return (
    <form className="schedule-selector" onSubmit={(e) => e.preventDefault()}>
      {schedule.map((e) => {
        const { schedule_id, schedule_date } = e;
        const [month, day] = schedule_date.split(' ');
        const selected = schedule_id === currentSchedule;
        return (
          <div style={{ display: 'inline' }} key={schedule_id}>
            <div className={selected ? 'date selected' : 'date unselected'} onClick={() => scheduleIndex(schedule_id)} style={selected ? themeColor : undefined}>
              <a className="month">{month}</a>
              <a className="day">{day}</a>
            </div>
          </div>
        );
      })}
    </form>
  );
}
