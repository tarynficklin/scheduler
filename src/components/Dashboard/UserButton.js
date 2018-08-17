import React, {Component} from 'react';
import {updateUserData, deleteUser} from '../../ducks/auth0';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import './UserButton.css';

class UserButton extends Component {
	constructor (props) {
		super(props);
		this.state = {
			loggingOut : false,
			background : `rgb(${this.props.color})`
		};
	};

	componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data)})};

	logout () {axios.get('/api/logout').then(() => {this.props.deleteUser()})};
	toggleLogOut () {
		const {loggingOut} = this.state
		this.setState({loggingOut: !loggingOut});
		loggingOut ? this.setState({background: `rgb(${this.props.color})`}) : this.setState({background: 'red'});
	};

	render () {
		const {user} = this.props;
		const {loggingOut, background} = this.state;
		console.log(this.props.color)

		return (
			<div className="user-button" style={{background}}>
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
		);
	};
};

function mapStateToProps (state) {return {user: state.auth0.user, color: state.reducer.color}};
export default connect(mapStateToProps, {updateUserData, deleteUser})(UserButton);