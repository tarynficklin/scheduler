import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './Missing.css'

export default class Missing extends Component {
  render(){
    return(
      <div className="missing">
        <frosted-glass overlay-color="#ffffff52" blur-amount="1.6rem" class="missing-card">
          <p>Page not found</p>
          <Link to="/"><button>Dashboard</button></Link>
        </frosted-glass>
      </div>
    )
  }
}