import React, { Component } from 'react';
import axios from 'axios';
import './ScheduleItem.css';

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
		};
	};

	componentWillReceiveProps (props) {props.editMode ? this.setState({editMode: true}) : this.setState({editMode: false})};

	getTitleInput (val) {this.setState({title: val})};
	getPriceInput (val) {this.setState({price: val})};
	updateTitle   (id)  {axios.put(`/api/schedule/item/title/${id}`, {title: this.state.title})};
	updatePrice   (id)  {axios.put(`/api/schedule/item/price/${id}`, {price: this.state.price})};
	toggleChecked (id)  {axios.put(`/api/schedule/item/check/${id}`, {checked: !this.state.checked}).then(this.setState({checked: !this.state.checked}))};
	deleteItem    (id)  {this.setState({deleted: true}); axios.delete(`/api/schedule/item/${id}`)};

  render () {
		const {id, title, price, checked, deleted, editMode} = this.state;
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};

		return (
			!deleted ?
			
				!editMode ?
					<div className="schedule-item">
						<a>• {title} </a>
						<a>{this.state.price*1===0 ? null : `- $${this.state.price}`}</a>
						{checked ?
							<div onClick={() => this.toggleChecked(id)} className="check-box checked" style={themeColor()}><i class="fas fa-check"></i></div>
							:
							<div onClick={() => this.toggleChecked(id)} className="check-box unchecked"><i class="fas fa-check"></i></div>
						}
					</div>
				:
					<div className="schedule-item">
						<input onChange={(e) => this.getTitleInput(e.target.value)} onBlur={() => this.updateTitle(id)} value={title} />
						<input onChange={(e) => this.getPriceInput(e.target.value)} onBlur={() => this.updatePrice(id)} value={price} type='number' min='0' />
						<button onClick={() => this.deleteItem(id)} style={themeColor()}><i class="fas fa-trash-alt"></i></button>
						<button onClick={() => this.setState({editMode: false})} style={themeColor()}><i class="fas fa-check"></i></button>
					</div> : null
		);
  };
};

export default ScheduleItem;