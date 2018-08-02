import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {updateUserData} from '../ducks/auth0';

class Dashboard extends Component {
	componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data);})}
	logout() {axios.get('/api/logout').then(res => {this.props.history.push('/')})}

	render () {
		console.log(this.props.user)
		return (
			<div>
				Dashboard
				<button onClick={() => this.logout()}>Logout</button>
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default connect(mapStateToProps, {updateUserData})(Dashboard);