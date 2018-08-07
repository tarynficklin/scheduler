import React, {Component} from 'react';
import ListItem from './ListItem';
import axios from 'axios';
import './ScheduleDay.css';

export default class ScheduleDay extends Component {
	constructor () {
		super ();
		this.state = {
			listItems: []
		}
	}
	
	componentDidMount () {
		const {id} = this.props;
		axios.get(`/api/schedule/item/${id}`).then(results => this.setState({listItems: results.data}));
	}

	render () {
		const {day, month, year} = this.props;
		const {listItems} = this.state;
		return (
			<div className="schedule-day">
   			<a>• {month}/{day}/{year}</a>
				 {listItems.map((e, i) => {
					return (
						<ListItem
							key={i}
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