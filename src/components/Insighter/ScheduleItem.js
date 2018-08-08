import React, { Component } from 'react';
import axios from 'axios';
import './ScheduleItem.css'

class ScheduleItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.title,
			price: this.props.price,
			checked: this.props.checked
		}
	}

	getTitleInput (val) {this.setState({title: val})}
	getPriceInput (val) {this.setState({title: val})}
	toggleChecked (id) {axios.put(`/api/schedule/item/check/${id}`, {checked: !this.state.checked}).then(this.setState({checked: !this.state.checked}))}

  render() {
		const {id, title, price, time} = this.props
		return (
			<div className="schedule-item">
				<a>{title} </a>
 				<a>{price} </a>
 				<a>{time} </a>
				<input onChange={(e) => this.getTitleInput(e.target.value)} placeholder={title} />
				<input onChange={(e) => this.getPriceInput(e.target.value)} placeholder={price} />
				<button>X</button>
				<input type="checkbox" checked={this.state.checked} onChange={() => this.toggleChecked(id)}/>
			</div>
		);
  }
}

export default ScheduleItem;