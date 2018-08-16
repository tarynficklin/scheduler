//dependencies
import React, { Component } from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {updateUserData} from './ducks/auth0';
import {connect} from 'react-redux';
import axios from 'axios';
import './App.css'

//components
import Landing   from './components/Common/Landing';
import Missing   from './components/Common/Missing';
import Dashboard from './components/Dashboard';
import NewTrip   from './components/NewTrip';
import Insighter from './components/Insighter';
import Blur from './Blur';

class App extends Component {
  constructor () {
    super();
    this.state = {
      background: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=13b58b0343d8efc06a88c55e843f624f&auto=format&fit=crop&w=1500&q=80'
    }
    this.updateBackground = this.updateBackground.bind(this);
  }

  componentDidMount () {
    axios.get('/api/user-data').then(res => {this.props.updateUserData(res.data);})
  }

  updateBackground(background) {
    this.setState({background})
    document.getElementById("app").style.cssText = `background: center fixed url(${this.state.background}); background-size: cover; min-height: 100vh; transition: 1s;`
  }

  render() {
    let {user} = this.props;
    return (
      <frosted-glass-container>
        <div id="app" style={{background: `center fixed url(${this.state.background})`, backgroundSize: `cover`, minHeight: `100vh`, transition: `1s`}}>
          {
            user.user_name ? (
              <HashRouter>
                <Switch>
                  <Route exact path="/" render={() => ( <Dashboard updateBackground={this.updateBackground}/> )}/>
                  <Route path="/new" render={() => ( <NewTrip updateBackground={this.updateBackground}/> )} />/>
                  <Route path="/trip/:id" render={() => ( <Insighter updateBackground={this.updateBackground}/> )} />
                  <Route path="/404" component={Missing} />
                  <Route path="/blur" component={Blur} />
                </Switch>
              </HashRouter>
            ) : <Landing />
          }
        </div>
      </frosted-glass-container>
    );
  }
}

function mapStateToProps (state) {return {user: state.auth0.user, background: state.reducer.background}}
export default connect(mapStateToProps, {updateUserData})(App);
