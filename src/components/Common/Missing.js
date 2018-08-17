import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './Missing.css';

class Missing extends Component {
  render(){
    return(
      <div className="missing">
        <frosted-glass overlay-color="#ffffff52" blur-amount="1.6rem" class="missing-card">
          <h3>Page not found</h3>
          <Link to="/"><button style={{backgroundColor: `rgb(${this.props.color})`}}>Dashboard</button></Link>
        </frosted-glass>
      </div>
    )
  }
}

function mapStateToProps (state) {return {color: state.reducer.color}};
export default connect(mapStateToProps)(Missing);