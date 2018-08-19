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
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};
		return (
			!deleted ? 

				!editMode ?

					<div className="packing-item">
						<a>• {this.state.title} </a>
						{checked ?
							<div onClick={() => this.toggleChecked(id)} className="check-box checked" style={themeColor()}><i class="fas fa-check"></i></div>
							:
							<div onClick={() => this.toggleChecked(id)} className="check-box unchecked"><i class="fas fa-check"></i></div>
						}
					</div>
				:
					<div className="packing-item">
						<input onChange={(e) => this.getTitleInput(e.target.value)} onBlur={() => this.updateTitle(id)} value={title} tabIndex={this.props.tab}/>
						<button style={themeColor()} onClick={() => this.deleteItem(id)}><i class="fas fa-trash-alt"></i></button>
						{checked ?
							<div onClick={() => this.toggleChecked(id)} className="check-box checked" style={themeColor()}><i class="fas fa-check"></i></div>
							:
							<div onClick={() => this.toggleChecked(id)} className="check-box unchecked"><i class="fas fa-check"></i></div>
						}
					</div>

			: null
		);
  };
};

export default PackingItem;