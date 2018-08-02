import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {updateUserData} from '../../ducks/auth0';
import {withRouter} from 'react-router-dom';

class UserButton extends Component {
	componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data);})}
	logout() {axios.get('/api/logout').then(res => {this.props.history.push('/')})}

	render () {
		let {user} = this.props;
		return (
			<div>
				UserButton
				<button onClick={() => this.logout()}>Logout</button>
				<div>
					<p>Account Holder: {user.user_name}</p>
					<img src={user.auth_profile} alt="" />
				</div>
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default withRouter(connect(mapStateToProps, {updateUserData})(UserButton));