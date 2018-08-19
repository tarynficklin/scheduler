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
				<frosted-glass overlay-color="#ffffff70" blur-amount="1.6rem" class="widget-card">
				<div>
					<div className="list-banner" style={themeColor()}>
						<h3>Packing List</h3>
						<button onClick={() => addPackingItem()} className="list-add"><i class="fas fa-plus"></i></button>
					</div>
					<div className="list-wrapper">
						<div className="list-items">
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
					</div>
					<div className="list-banner list-footer" style={themeColor()}>
						<button onClick={() => this.toggleEditMode()}><i class="fas fa-edit"></i></button>
						<button onClick={() => this.revealWidget()}><i class="fas fa-check"></i></button>
					</div>
				</div>
				</frosted-glass> : null }
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-briefcase"></i></button>
			</div>
		);
	};
};

export default PackingWidget