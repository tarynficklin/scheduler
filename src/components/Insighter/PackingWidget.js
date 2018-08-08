import React from 'react'
import PackingItem from './PackingItem'
import './PackingWidget.css'

export default function PackingWidget(props) {
	const {packingList, deletePackingItem} = props
	return (
		<div className="packing-widget">
			<h3>Packing List Widget</h3>
			{packingList.map((e, i) => {
					return (
						<PackingItem
							key={i}
							id={e.packing_id}
							title={e.packing_title}
							checked={e.packing_checked}
							deletePackingItem={deletePackingItem}
						/>
					)
				})
			}
		</div>
	)
}

// import React, {Component} from 'react'
// import PackingItem from './PackingItem'
// import './PackingWidget.css'

// class PackingWidget extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			packingList: this.props.packingList
// 		}
// 	}

//   render() {
// 		console.log(this.state.packingList)
// 		const {packingList} = this.props
// 		return (
// 			<div className="packing-widget">
// 				<h3>Packing List Widget</h3>
// 				{packingList.map((e, i) => {
// 						return (
// 							<PackingItem
// 								key={i}
// 								id={e.packing_id}
// 								title={e.packing_title}
// 								checked={e.packing_checked}
// 							/>
// 						)
// 					})
// 				}
// 			</div>
// 		);
//   }
// }

// export default PackingWidget;