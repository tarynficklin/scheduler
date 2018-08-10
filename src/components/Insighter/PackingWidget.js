import React from 'react'
import PackingItem from './PackingItem'
import './PackingWidget.css'

export default function PackingWidget(props) {
	const {packingList, addPackingItem} = props
	return (
		<div className="packing-widget">
			<h3>Packing List Widget</h3>
			<button onClick={() => addPackingItem()}>+</button>
			{packingList.map((e, i) => {
					return (
						<PackingItem
							key={i}
							id={e.packing_id}
							title={e.packing_title}
							checked={e.packing_checked}
						/>
					)
				})
			}
		</div>
	)
}