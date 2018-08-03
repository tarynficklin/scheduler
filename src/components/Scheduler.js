import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Scheduler extends Component {
	constructor () {
		super();
		this.state = {
			
		}
	}

	componentDidMount() {}

	render () {
		const {id} = this.props.match.params
		return (
			<div>
				<Link to="/"><button>X</button></Link>
				Scheduler Component
				<p>{id}</p>
			</div>
		)
	}
}

export default Scheduler;