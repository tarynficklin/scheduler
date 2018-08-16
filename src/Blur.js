import React, {Component} from "react";
import './Blur.css';

class Blur extends Component {
  render () {
    return (
      <div>
        <frosted-glass overlay-color="#ffffff52" blur-amount="1.6rem" class="blur-card">
          <h1>Frosted Glass</h1>
          <div>next level street art gastropub flannel keytar sartorial sustainable ennui Brooklyn kitsch artisan typewriter</div>
          <a href="#">Hello, I am terrible, awful anchor tags.</a>
          <button>Order now</button>
        </frosted-glass>
      </div>
    )
  }
}

export default Blur