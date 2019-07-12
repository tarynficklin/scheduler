import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './Missing.css';

class Missing extends Component {
  render(){
    let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};
    return(
      <div className="missing">
        <frosted-glass overlay-color="rgba(255, 255, 255, 0.5)" blur-amount="1.6rem" class="missing-card">
          <h3>Page not found</h3>
          <Link to="/"><button style={themeColor()}>Dashboard</button></Link>
        </frosted-glass>
      </div>
    )
  }
}

function mapStateToProps (state) {return {color: state.reducer.color}};
export default connect(mapStateToProps)(Missing);