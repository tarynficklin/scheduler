// Login / signup page (replaces the redirect to Auth0). Local accounts only, and not
// secure by design: development only. The seeded dev account is documented in
// db/master_seed.sql and the README.
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateUserData } from '../../ducks/auth';
import api, { errorMessage } from '../../lib/api';
import FadeIn from './FadeIn';
import Glass from './Glass';
import logo from './logo.png';
import './Landing.css';

const EMPTY = { login: '', username: '', email: '', password: '' };

function Landing({ color, updateUserData }) {
  const [mode, setMode] = useState('login');
  const [fields, setFields] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';
  const themeColor = { backgroundColor: `rgb(${color})` };
  const update = (name) => (event) => setFields({ ...fields, [name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { data: user } = isSignup
        ? await api.post('/api/signup', {
            username: fields.username,
            email: fields.email,
            password: fields.password,
          })
        : await api.post('/api/login', { login: fields.login, password: fields.password });
      updateUserData(user);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  return (
    <FadeIn transitionDuration="800">
      <div className="landing">
        <div className="logo-wrapper">
          <Glass overlayColor="rgba(255, 255, 255, 0.5)" blurAmount="1.6rem" className="logo">
            <img src={logo} alt="" />
          </Glass>
          <h1>Planner</h1>
          <Glass overlayColor="rgba(255, 255, 255, 0.5)" blurAmount="1.6rem" className="login-card">
            <form onSubmit={submit}>
              <div className="login-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isSignup}
                  className={!isSignup ? 'active' : ''}
                  onClick={() => switchMode('login')}
                >
                  Log in
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSignup}
                  className={isSignup ? 'active' : ''}
                  onClick={() => switchMode('signup')}
                >
                  Sign up
                </button>
              </div>

              {isSignup ? (
                <>
                  <input
                    value={fields.username}
                    onChange={update('username')}
                    placeholder="username"
                    autoComplete="username"
                    aria-label="Username"
                    autoFocus
                    required
                  />
                  <input
                    type="email"
                    value={fields.email}
                    onChange={update('email')}
                    placeholder="email (optional)"
                    autoComplete="email"
                    aria-label="Email"
                  />
                </>
              ) : (
                <input
                  value={fields.login}
                  onChange={update('login')}
                  placeholder="username or email"
                  autoComplete="username"
                  aria-label="Username or email"
                  autoFocus
                  required
                />
              )}
              <input
                type="password"
                value={fields.password}
                onChange={update('password')}
                placeholder="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                aria-label="Password"
                required
              />

              {error ? (
                <p className="login-error" role="alert">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="login-submit" style={themeColor} disabled={busy}>
                {busy ? '...' : isSignup ? 'Create account' : 'Login'}
              </button>
            </form>
          </Glass>
        </div>
      </div>
    </FadeIn>
  );
}

function mapStateToProps(state) {
  return { color: state.reducer.color };
}
export default connect(mapStateToProps, { updateUserData })(Landing);
