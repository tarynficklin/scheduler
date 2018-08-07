import React, { Component } from 'react';
import axios from 'axios';

class ListItem extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			price: 0,
			checked: false
		}
	}

	componentDidMount() {
		const {title, price, checked} = this.props;
		this.setState({title, price, checked})
	}

	getTitleInput (val) {this.setState({title: val})}
	handleChecked (id, checked) {axios.put(`/api/schedule/item/check/${id}`, {checked: !this.state.checked}).then(this.setState({checked: !this.state.checked}))}

  render() {
		const {id, title, price, time, checked} = this.props
		return (
			<div>
				<a>{title} </a>
 				<a>{price} </a>
 				<a>{time}</a>
				<input onChange={(e) => this.getTitleInput(e.target.value)} placeholder={title} />
				<button>X</button>
				<input type="checkbox" checked={this.state.checked} onChange={() => this.handleChecked(id, checked)}/>
			</div>
		);
  }
}

export default ListItem;