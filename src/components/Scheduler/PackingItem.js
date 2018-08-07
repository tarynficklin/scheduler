import React from 'react';
import './PackingItem.css';

export default function PackingItem(props) {
	const {title} = props
	return (
		<div className="packing-item">
			<a>• {title}</a>
		</div>
	)
}