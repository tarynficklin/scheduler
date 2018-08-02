import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Creator extends Component {
	constructor () {
		super();
		this.state = {
			
		}
	}

	componentDidMount() {}

	render () {
		return (
			<div>
				<Link to="/"><button>X</button></Link>
			</div>
		)
	}
}

export default Creator;