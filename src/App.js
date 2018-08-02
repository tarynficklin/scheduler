import React, { Component } from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

import {updateUserData} from './ducks/auth0';
import axios from 'axios';
import {connect} from 'react-redux';

class App extends Component {
  componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data);})}
  login () {
    const {REACT_APP_DOMAIN, REACT_APP_CLIENT_ID} = process.env;
    const url = `${window.location.origin}/auth/callback`;
    window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`
  }
  render() {
    let {user} = this.props;
    return (
      <div>
        {
					user.user_name ? (
          <HashRouter>
            <Switch>
              <Route exact path='/' component={Login}/>
              <Route path="/dashboard" component={Dashboard}/>
            </Switch>
          </HashRouter>
					) : <div><button onClick={() => this.login()}>Login</button><p>Please Log in.</p></div>
				}
      </div>
    );
  }
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default connect(mapStateToProps, {updateUserData})(App);
