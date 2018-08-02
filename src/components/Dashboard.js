import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {updateUserData} from '../ducks/auth0';
import UserButton from './Dashboard/UserButton';

class Dashboard extends Component {
	componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data);})}
	logout() {axios.get('/api/logout').then(res => {this.props.history.push('/')})}

	render () {
		let {user} = this.props;
		return (
			<div>
				Dashboard
				{
					user.user_name ? (
						<div>
							<UserButton />
						</div>
					) : <p>Please Log in.</p>
				}
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default connect(mapStateToProps, {updateUserData})(Dashboard);