import React, {Component} from 'react';
import ScheduleItem from './ScheduleItem';
import axios from 'axios';
import './ScheduleList.css';

export default class ScheduleList extends Component {
	constructor (props) {
		super (props);
		this.state = {
			scheduleItems : [],
			selected      : false,
			edit_mode     : false,
		}
		this.toggleEditMode = this.toggleEditMode.bind(this);
	}

	componentDidMount () {this.selectedSchedule(this.props.id, this.props.currentSchedule)};
	componentWillReceiveProps (props) {this.selectedSchedule(props.id, props.currentSchedule)};

	selectedSchedule (id, currentSchedule) {
		axios.get(`/api/schedule/item/${this.props.id}`).then(results => this.setState({scheduleItems: results.data}));
		id === currentSchedule ? this.setState({selected: true}) : this.setState({selected: false});
	}

	async addScheduleItem () {
		const {id} = this.props;
		const {scheduleItems} = this.state;
		const results = await axios.post(`/api/schedule/item`, {
			schedule_id : id,
			item_title  : "New Schedule Item",
			item_price  : 0,
			item_time   : "morning"
		});
		scheduleItems.push(results.data);
		this.setState({scheduleItems});
	}

	toggleEditMode() {this.setState({edit_mode: !this.state.edit_mode})};

	render () {
		const {scheduleItems, selected, edit_mode} = this.state;
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};
		return (
			selected ?
			<div className="schedule-list">
				<button onClick={() => this.addScheduleItem()} style={themeColor()}><i class="fas fa-plus"></i></button>
				<button onClick={() => this.toggleEditMode()} style={themeColor()}>Edit</button>
				 {scheduleItems.map((e, i) => {
					return (
						<ScheduleItem
							key={i}
							id={e.item_id}
							title={e.item_title}
							price={e.item_price}
							time={e.item_time}
							checked={e.item_checked}
							editMode={edit_mode}
							color={this.props.color}
						/>
					)
				})}
   		</div> : null
		);
	};
};