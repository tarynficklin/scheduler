import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {updateUserData} from '../ducks/auth0';

class Dashboard extends Component {
	componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data);})}
	logout() {axios.get('/api/logout').then(res => {this.props.history.push('/')})}

	render () {
		console.log(this.props.user)
		let {user} = this.props;
		return (
			<div>
				Dashboard
				<button onClick={() => this.logout()}>Logout</button>
				{
					user.user_name ? (
						<div>
							<p>Account ID: {user.user_id}</p>
							<p>Account Holder: {user.user_name}</p>
							<p>Account Email: {user.user_email}</p>
							<p>Account Number: {user.auth_id}</p>
							<img src={user.auth_profile} alt="" />
						</div>
					) : <p>Please Log in.</p>
				}
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default connect(mapStateToProps, {updateUserData})(Dashboard);