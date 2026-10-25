//dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router';
import { updateUserData } from './ducks/auth';
import api from './lib/api';
import { consumeDonationResult } from './lib/donation';
import './App.css';

import FadeIn from './components/Common/FadeIn';
//components
import Landing from './components/Common/Landing';
import Missing from './components/Common/Missing';
import Dashboard from './components/Dashboard';
import Insighter from './components/Insighter';
import NewTrip from './components/NewTrip';

const DONATION_MESSAGES = {
  success: 'Thank you for the donation!',
  cancelled: 'Donation cancelled. No payment was made.',
};

class App extends Component {
  constructor(props) {
    super(props);
    // Read (and clear) ?donation=... before the hash router reads the URL.
    this.state = { ready: false, donation: consumeDonationResult() };
  }

  componentDidMount() {
    api
      .get('/api/user-data')
      .then((res) => this.props.updateUserData(res.data))
      .catch(() => {}) // 401: not logged in, show the login page
      .finally(() => this.setState({ ready: true }));
  }

  render() {
    const { user, background } = this.props;
    const { ready, donation } = this.state;
    // Background longhands only: when the `background` shorthand changed, React re-applied
    // it alone, which reset background-size to auto and tiled the wallpaper.
    return (
      <div
        id="app"
        style={{
          backgroundImage: background ? `url(${background})` : 'none',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          transition: '1s',
        }}
      >
        {donation ? (
          <div className="notice" role="status">
            <span>{DONATION_MESSAGES[donation]}</span>
            <button onClick={() => this.setState({ donation: null })} aria-label="Dismiss">
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : null}
        {ready ? (
          <FadeIn delay="1000" transitionDuration="800">
            {user.user_id ? (
              <HashRouter>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/new" element={<NewTrip />} />
                  <Route path="/trip/:id" element={<Insighter />} />
                  <Route path="*" element={<Missing />} />
                </Routes>
              </HashRouter>
            ) : (
              <Landing />
            )}
          </FadeIn>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.auth.user, background: state.reducer.background };
}
export default connect(mapStateToProps, { updateUserData })(App);
