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
					) : <Login />
				}
      </div>
    );
  }
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default connect(mapStateToProps, {updateUserData})(App);
