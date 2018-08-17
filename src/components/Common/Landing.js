import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Landing.css';

class Landing extends Component {

  login () {
    const {REACT_APP_DOMAIN, REACT_APP_CLIENT_ID} = process.env;
    const url = `${window.location.origin}/auth/callback`;
    window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`
  }

  render(){
    return(
      <div className="landing">
        <frosted-glass overlay-color="#FFFFFF50" blur-amount="1.6rem" class="landing-card">
          <h2>Please Log in</h2>
          <button onClick={() => this.login()} style={{backgroundColor: `rgb(${this.props.color})`}}>Login</button>
        </frosted-glass>
      </div>
    )
  }
}


function mapStateToProps (state) {return {color: state.reducer.color}};
export default connect(mapStateToProps)(Landing);