import React, {Component} from 'react';
import ScheduleItem from './ScheduleItem';
import axios from 'axios';
import './ScheduleList.css';

export default class ScheduleList extends Component {
	constructor () {
		super ();
		this.state = {
			scheduleItems: []
		}
	}
	
	componentDidMount () {axios.get(`/api/schedule/item/${this.props.id}`).then(results => this.setState({scheduleItems: results.data}))}

	addScheduleItem() {
		const {id} = this.props;
		const {scheduleItems} = this.state;
		axios.post(`/api/schedule/item`, {schedule_id: id, item_title: "", item_price: 0, item_time: "morning"}).then(results => {
			scheduleItems.push(results.data);
			this.setState({scheduleItems});
		})
	}

	render () {
		const {day, month, year} = this.props;
		const {scheduleItems} = this.state;
		return (
			<div className="schedule-list">
   			<a>• {month}/{day}/{year} </a>
				<button onClick={() => this.addScheduleItem()}>+</button>
				 {scheduleItems.map((e, i) => {
					return (
						<ScheduleItem
							key={i}
							id={e.item_id}
							title={e.item_title}
							price={e.item_price}
							time={e.item_time}
							checked={e.item_checked}
						/>
					)
				})
			}
   		</div>
		)
	}
}