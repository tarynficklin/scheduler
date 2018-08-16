import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {updateUserData, deleteUser} from '../../ducks/auth0';
import {Link} from 'react-router-dom';
import './UserButton.css';

class UserButton extends Component {
	constructor () {
		super();
		this.state = {
			loggingOut: false,
			background: '#00AEFF'
		}
	}

	componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data)})}
	toggleLogOut () {
		this.setState({loggingOut: !this.state.loggingOut})
		if (this.state.loggingOut) {this.setState({background: '#00AEFF'})}
		else {this.setState({background: 'red'})}
	}
	logout () {axios.get('/api/logout').then(() => {this.props.deleteUser()})}

	render () {
		const {loggingOut} = this.state;
		const {user} = this.props;
		return (
			<div className="user-button" style={{background: `${this.state.background}`}}>
			{!loggingOut ?
				<div className="user-div">
					<Link to="/new"><button className="new-button">New Trip +</button></Link>
					<img src={user.auth_profile} at="" className="profile-pic" onClick={() => this.toggleLogOut()} alt=""/>
				</div>
			: 
				<div className="user-div">
					<button onClick={() => this.logout()} className="logout-button">Logout</button>
					<button onClick={() => this.toggleLogOut()} className="exit-button">X</button>
					<img src={user.auth_profile} at="" className="profile-pic" onClick={() => this.toggleLogOut()} alt=""/>
				</div>}
			</div>
		)
	}
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default connect(mapStateToProps, {updateUserData, deleteUser})(UserButton);