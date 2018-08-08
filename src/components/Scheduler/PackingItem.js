import React, { Component } from 'react';
import axios from 'axios';
import './PackingItem.css';

class PackingItem extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			checked: false
		}
	}

	componentDidMount() {
		const {title, checked} = this.props;
		this.setState({title, checked})
	}

	getTitleInput (val) {this.setState({title: val})}
	toggleChecked (id) {axios.put(`/api/list/check/${id}`, {checked: !this.state.checked}).then(this.setState({checked: !this.state.checked}))}

  render() {
		const {id, title} = this.props
		return (
			<div className="packing-item">
				<a>• {title} </a>
				<input onChange={(e) => this.getTitleInput(e.target.value)} placeholder={title} />
				<button>X</button>
				<input type="checkbox" checked={this.state.checked} onChange={() => this.toggleChecked(id)}/>
			</div>
		);
  }
}

export default PackingItem;