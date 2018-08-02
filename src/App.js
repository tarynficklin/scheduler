import React, { Component } from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import axios from 'axios';

import {connect} from 'react-redux';
import {updateUserData} from './ducks/auth0';

import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Creator from './components/Creator';

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
              <Route exact path="/" component={Dashboard}/>
              <Route path="/new" component={Creator} />
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
