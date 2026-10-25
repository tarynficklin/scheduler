import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { deleteUser } from '../../ducks/auth';
import api from '../../lib/api';
import './UserButton.css';

class UserButton extends Component {
  constructor(props) {
    super(props);
    this.state = { loggingOut: false };
  }

  logout() {
    api
      .get('/api/logout')
      .then(() => this.props.deleteUser())
      .catch((err) => console.error(err));
  }

  toggleLogOut() {
    this.setState({ loggingOut: !this.state.loggingOut });
  }

  render() {
    const { user, color } = this.props;
    const { loggingOut } = this.state;
    const background = loggingOut ? 'red' : `rgb(${color})`;
    // Auth0 supplied a profile picture; local accounts show their initial instead.
    const avatar = (
      <button
        className="profile-pic"
        onClick={() => this.toggleLogOut()}
        title={user.user_name}
        aria-label="Account"
      >
        {(user.user_name || '?').charAt(0).toUpperCase()}
      </button>
    );

    return (
      <div className="user-button" style={{ background }}>
        {!loggingOut ? (
          <div className="user-div">
            <Link to="/new">
              <button className="new-button">
                New Trip <i className="fas fa-plus"></i>
              </button>
            </Link>
            {avatar}
          </div>
        ) : (
          <div className="user-div">
            <button onClick={() => this.logout()} className="logout-button">
              Logout
            </button>
            <button onClick={() => this.toggleLogOut()} className="exit-button" aria-label="Cancel">
              <i className="fas fa-times"></i>
            </button>
            {avatar}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.auth.user, color: state.reducer.color };
}
export default connect(mapStateToProps, { deleteUser })(UserButton);
