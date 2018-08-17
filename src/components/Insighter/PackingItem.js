import React, { Component } from 'react';
import axios from 'axios';
import './PackingItem.css';

class PackingItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id       : this.props.id,
			title    : this.props.title,
			checked  : this.props.checked,
			editMode : false,
			deleted  : false
		};
	};

	componentWillReceiveProps (props) {
		const {editMode} = props;
		editMode ? this.setState({editMode: true}) : this.setState({editMode: false});
	}

	getTitleInput (val) {this.setState({title: val})};
	updateTitle   (id)  {axios.put(`/api/list/${id}`, {packing_title: this.state.title})};
	toggleChecked (id)  {axios.put(`/api/list/check/${id}`, {checked: !this.state.checked}).then(this.setState({checked: !this.state.checked}))};
	deleteItem    (id)  {this.setState({deleted: true}); axios.delete(`/api/list/${id}`)};
	
  render() {
		const {id, title, checked, deleted, editMode} = this.state;

		return (
			!deleted ? 

				!editMode ?

					<div className="packing-item">
						<a>• {this.state.title} </a>
						<input type="checkbox" checked={checked} onChange={() => this.toggleChecked(id)}/>
					</div>
				:
					<div className="packing-item">
						<input onChange={(e) => this.getTitleInput(e.target.value)} onBlur={() => this.updateTitle(id)} value={title} />
						<button onClick={() => this.deleteItem(id)}>X</button>
						<input type="checkbox" checked={checked} onChange={() => this.toggleChecked(id)}/>
					</div>

			: null
		);
  };
};

export default PackingItem;