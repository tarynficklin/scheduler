import React, {Component} from 'react';
import axios from 'axios';

class Dashboard extends Component {
	logout() {
		axios.get('/api/logout').then(res => {
			this.props.history.push('/')
		})
	}

	render () {
		return (
			<div>
				Dashboard
				<button onClick={() => this.logout()}>Logout</button>
			</div>
		)
	}
}

export default Dashboard;