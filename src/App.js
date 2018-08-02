import React, { Component } from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path="/dashboard" component={Dashboard}/>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
