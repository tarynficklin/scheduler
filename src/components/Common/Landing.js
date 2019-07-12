import React, {Component} from 'react';
import {connect} from 'react-redux';
import FadeIn from 'react-fade-in';
import logo from './logo.png'
import './Landing.css';

class Landing extends Component {

  login () {
    const {REACT_APP_DOMAIN, REACT_APP_CLIENT_ID} = process.env;
    const url = `${window.location.origin}/auth/callback`;
    window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`
  }

  render(){
    let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};
    return(
      <FadeIn transitionDuration="800">
        <div className="landing">
          <div className="logo-wrapper">
            <frosted-glass overlay-color="rgba(255, 255, 255, 0.5)" blur-amount="1.6rem" class="logo">
              <img src={logo} alt=""/>
            </frosted-glass>
            <h1>Scheduler</h1>
            <frosted-glass overlay-color="rgba(255, 255, 255, 0.5)" blur-amount="1.6rem" class="login-wrapper">
              <button onClick={() => this.login()} style={themeColor()}>Login</button>
            </frosted-glass>
          </div>
          {/* <frosted-glass overlay-color="rgba(255, 255, 255, 0.5)" blur-amount="1.6rem" class="landing-card">
            <h2>Please Log in</h2>
            <button onClick={() => this.login()} style={themeColor()}>Login</button>
          </frosted-glass> */}
        </div>
      </FadeIn>
    )
  }
}


function mapStateToProps (state) {return {color: state.reducer.color}};
export default connect(mapStateToProps)(Landing);