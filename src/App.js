import React, { Component } from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import axios from 'axios';
import './App.css'

import {connect} from 'react-redux';
import {updateUserData} from './ducks/auth0';

import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Creator from './components/Creator';
import Scheduler from './components/Scheduler';
import Missing from './components/Missing';

class App extends Component {
  componentDidMount () {axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data);})}
  render() {
    let {user} = this.props;
    return (
      <div className="app">
        {
					user.user_name ? (
          <HashRouter>
            <Switch>
              <Route exact path="/" component={Dashboard}/>
              <Route path="/new" component={Creator} />
              <Route path="/trip/:id" component={Scheduler} />
              <Route path="/404" component={Missing} />
            </Switch>
          </HashRouter>
					) : <Landing />
				}
      </div>
    );
  }
}

function mapStateToProps (state) {return {user: state.auth0.user}}
export default connect(mapStateToProps, {updateUserData})(App);
