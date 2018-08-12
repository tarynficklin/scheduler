import React, {Component} from 'react'
import PackingItem from './PackingItem'
import './PackingWidget.css'

class PackingWidget extends Component {
	constructor () {
		super();
		this.state = {
			editMode: false
		}
	}

	toggleEditMode() {this.setState({editMode: !this.state.editMode})}

	render () {
		const {packingList, addPackingItem} = this.props
		return (
			<div className="packing-widget">
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
			</div>
		)
	}
}

export default PackingWidget