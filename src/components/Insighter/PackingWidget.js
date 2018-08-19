import React, {Component} from 'react';
import PackingItem from './PackingItem';
import './PackingWidget.css';

class PackingWidget extends Component {
	constructor () {
		super();
		this.state = {
			packingList : [],
			revealed    : false,
			editMode    : false
		};
	};

	revealWidget   () {this.setState({revealed: !this.state.revealed})};
	toggleEditMode () {this.setState({editMode: !this.state.editMode})};

	render () {
		const {revealed} = this.state;
		const {packingList, addPackingItem} = this.props;
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};

		return (
			<div className="packing-widget widget">
			{
				revealed ?
				<frosted-glass overlay-color="#ffffff50" blur-amount="1.6rem" class="widget-card">
				<div>
					<h3>Packing List Widget</h3>
					<button onClick={() => addPackingItem()} style={themeColor()}><i class="fas fa-plus"></i></button>
					<button onClick={() => this.toggleEditMode()} style={themeColor()}>Edit</button>
					{packingList.map((e, i) => {
							return (
								<PackingItem
									key={i}
									tab={i}
									id={e.packing_id}
									title={e.packing_title}
									checked={e.packing_checked}
									editMode={this.state.editMode}
									color={this.props.color}
								/>
							)
						})}
				</div>
				</frosted-glass> : null }
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-briefcase"></i></button>
			</div>
		);
	};
};

export default PackingWidget