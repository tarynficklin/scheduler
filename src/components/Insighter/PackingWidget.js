import React, {Component} from 'react';
import PackingItem from './PackingItem';
import axios from 'axios';
import './PackingWidget.css';

class PackingWidget extends Component {
	constructor () {
		super();
		this.state = {
			packingList : [],
			revealed    : false,
			editMode    : false
		};
		this.updateList = this.updateList.bind(this);
	};

	componentDidMount () {this.updateList()};
	componentWillReceiveProps (props) {this.updateList();}
	
	updateList() {axios.get(`/api/list/${this.props.id}`).then(results => this.setState({packingList: results.data}))}

	revealWidget   () {
		console.log('trip fired')
		this.updateList();
		this.setState({revealed: !this.state.revealed})
	};

	toggleEditMode () {this.setState({editMode: !this.state.editMode})};

	async addPackingItem () {
		const {packingList} = this.state;
		const {id} = this.props;
		const results = await axios.post(`/api/list`, {trip_id: id, packing_title: "New Item"});
		await packingList.push(results.data);
		await this.setState({packingList});
	};

	render () {
		const {packingList, revealed} = this.state;
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};

		return (
			<div className="packing-widget widget">
			{
				revealed ?
				<frosted-glass overlay-color="#ffffff70" blur-amount="1.6rem" class="widget-card">
				<div>
					<div className="list-banner" style={themeColor()}>
						<h3>Packing List</h3>
						<button onClick={() => this.addPackingItem()} className="list-add"><i class="fas fa-plus"></i></button>
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
											revealed={this.state.revealed}
											editMode={this.state.editMode}
											color={this.props.color}
										/>
									)
								})}
						</div>
					</div>
					<div className="list-banner list-footer" style={themeColor()}>
						<button onClick={() => this.toggleEditMode()}><i class="fas fa-edit"></i></button>
						<button onClick={() => {this.revealWidget()}}><i class="fas fa-check"></i></button>
					</div>
				</div>
				</frosted-glass> : null }
				{revealed ? <div class="arrow" style={{borderTop: `10px solid rgb(${this.props.color})`}}></div> : null}
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-briefcase"></i></button>
			</div>
		);
	};
};

export default PackingWidget