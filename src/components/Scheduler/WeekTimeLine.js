import React from 'react';

export default function WeekTimeline(props) {
	return (
		<form action="">
			<a>mon</a>
			<input type="radio" name="weekday" val="mon"/>
			<a>tue</a>
			<input type="radio" name="weekday" vale="tue"/>
			<a>wed</a>
			<input type="radio" name="weekday" val="wed"/>
			<a>thur</a>
			<input type="radio" name="weekday" val="thur"/>
			<a>fri</a>
			<input type="radio" name="weekday" val="fri"/>
			<a>sat</a>
			<input type="radio" name="weekday" val="sat"/>
			<a>sun</a>
			<input type="radio" name="weekday" val="sun"/>
		</form>
	)
}