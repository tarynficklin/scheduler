import React from 'react'
import './Schedule.css'

export default function Schedule(props) {
	const {schedule} = props
	return (
		<div className="schedule">
			<p>schedule: {JSON.stringify(schedule)}</p>
		</div>
	)
}

// import React, {Component} from 'react';
// import axios from 'axios';
// import './Schedule.css';

// class Schedule extends Component {
// 	constructor () {
// 		super();
// 		this.state = {
// 			schedule: {}
// 		}
// 	}

// 	componentDidMount() {
// 		const {id} = this.props;
// 		axios.get(`/api/schedule/${id}`).then(results => console.log(results.data));
// 	}

// 	render () {
// 		const {id} = this.props;
// 		console.log(id)
// 		return (
// 			<div className="schedule">
// 				<p>schedule: {id}</p>
// 			</div>
// 		)
// 	}
// }

// export default Schedule