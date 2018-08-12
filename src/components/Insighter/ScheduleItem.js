import React, { Component } from 'react';
import axios from 'axios';
import './ScheduleItem.css'

class ScheduleItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id       : this.props.id,
			title    : this.props.title,
			price    : this.props.price,
			checked  : this.props.checked,
			editMode : false,
			deleted  : false
		}
	}

	componentWillReceiveProps (props) {
		const {editMode} = props
		if (editMode) {this.setState({editMode: true})}
		else {this.setState({editMode: false})}
	}

	getTitleInput (val) {this.setState({title: val})};
	getPriceInput (val) {this.setState({price: val})};
	updateTitle   (id)  {axios.put(`/api/schedule/item/title/${id}`, {title: this.state.title})};
	updatePrice   (id)  {axios.put(`/api/schedule/item/price/${id}`, {price: this.state.price})};
	toggleChecked (id)  {axios.put(`/api/schedule/item/check/${id}`, {checked: !this.state.checked}).then(this.setState({checked: !this.state.checked}))};
	deleteItem    (id)  {this.setState({deleted: true}); axios.delete(`/api/schedule/item/${id}`)};

  render() {
		const {id, title, price, deleted, editMode} = this.state
		return (
			!deleted ?
			
				!editMode ?
					<div className="schedule-item">
						<a>• {title} </a>
						<a>{price} </a>
						<input type="checkbox" checked={this.state.checked} onChange={() => this.toggleChecked(id)}/>
					</div>
				:
					<div className="schedule-item">
						<input onChange={(e) => this.getTitleInput(e.target.value)} onBlur={() => this.updateTitle(id)} value={title} />
						<input onChange={(e) => this.getPriceInput(e.target.value)} onBlur={() => this.updatePrice(id)} value={price} type='number' min='0' />
						<button onClick={() => this.deleteItem(id)}>X</button>
						<input type="checkbox" checked={this.state.checked} onChange={() => this.toggleChecked(id)}/>
					</div>
			
			: null
			
		);
  }
}

export default ScheduleItem;