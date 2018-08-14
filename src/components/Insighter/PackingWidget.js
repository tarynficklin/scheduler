import React, {Component} from 'react'
import PackingItem from './PackingItem'
import './PackingWidget.css'

class PackingWidget extends Component {
	constructor () {
		super();
		this.state = {
			revealed: false,
			editMode: false
		}
	}

	revealWidget () {this.setState({revealed: !this.state.revealed})}
	toggleEditMode() {this.setState({editMode: !this.state.editMode})}

	render () {
		const {revealed} = this.state
		const {packingList, addPackingItem} = this.props
		return (
			<div className="packing-widget" style={{display: 'inline'}}>
			<button onClick={() => this.revealWidget()}>Packing List</button>
			{
				revealed ? 
				<div>
					<h3>Packing List Widget</h3>
					<button onClick={() => addPackingItem()}>+</button>
					<button onClick={() => this.toggleEditMode()}>Edit</button>
					{packingList.map((e, i) => {
							return (
								<PackingItem
									key={i}
									id={e.packing_id}
									title={e.packing_title}
									checked={e.packing_checked}
									editMode={this.state.editMode}
								/>
							)
						})
					}
				</div> : null
			}
			</div>
		)
	}
}

export default PackingWidget