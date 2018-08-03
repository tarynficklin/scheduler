import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Creator.css'

import Header from './Creator/Header'
import Calendar from './Creator/Calendar';
import Location from './Creator/Location';
import Budget from './Creator/Budget';
import Packing from './Creator/Packing';

class Creator extends Component {
	componentDidMount() {}

	render () {
		return (
			<div className="creator">
				<Header />
				<Location />
				<Calendar />
				<Budget />
				<Packing />
				<Link to="/trip/1"><button>Done</button></Link>
			</div>
		)
	}
}

export default Creator;