import React, {Component} from 'react'
import './BudgetWidget.css'
import axios from 'axios';

class BudgetWidget extends Component {

	constructor () {
		super();
		this.state = {
			budget: 0
		}
	}

	getBudgetInput (val) {this.setState({budget: val})}
	updateBudget (id) {axios.put(`/api/trips/budget/${id}`, {budget: this.state.budget})}
	
	render () {
		const {id, budget} = this.props
		return (
			<div className="budget-widget">
				<h3>Budget Widget</h3>
				<p>Current Budget: {budget}</p>
				<input onChange={(e) => this.getBudgetInput(e.target.value)} onBlur={() => this.updateBudget(id)} placeholder={budget} />
			</div>
		)
	}

}

export default BudgetWidget