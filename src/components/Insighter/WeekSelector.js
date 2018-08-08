import React from 'react';
import './WeekSelector.css'

export default function WeekSelector(props) {
	return (
		<div className="week-selector">
			<button>Previous</button>
			<a>Week 1</a>
			<button>Next</button>
		</div>
	)
}