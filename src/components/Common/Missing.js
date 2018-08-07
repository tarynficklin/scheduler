import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './Missing.css'

export default class Missing extends Component {
  render(){
    return(
      <div className="missing">
        <p>Page not found</p>
        <Link to="/"><button>Dashboard</button></Link>
      </div>
    )
  }
}