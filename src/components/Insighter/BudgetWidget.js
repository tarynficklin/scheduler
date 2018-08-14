import React, {Component} from 'react';
import axios from 'axios';
import './BudgetWidget.css';

class BudgetWidget extends Component {
	constructor () {
		super();
		this.state = {
			budgetTotal: 0,
			alert: null,
			revealed: false		
		}
	}

	componentWillReceiveProps (props) {
		if (props.id !== 0) {axios.get(`/api/trips/total/${this.props.id}`)
			.then(results => {
				this.setState({budgetTotal: results.data.sum})
				if (this.state.budgetTotal > this.props.budget) {this.setState({alert: 'red'})}
				else {this.setState({alert: null})}
			})
		}
	}

	// componentDidUpdate(props) {
	// 	if (props.id !== 0) {axios.get(`/api/trips/total/${this.props.id}`)
	// 		.then(results => {
	// 			this.setState({budgetTotal: results.data.sum})
	// 			if (this.state.budgetTotal > this.props.budget) {this.setState({alert: 'red'})}
	// 			else {this.setState({alert: null})}
	// 		})
	// 	}
	// }

	revealWidget () {
		this.setState({revealed: !this.state.revealed})
		if (this.props.id !== 0) {axios.get(`/api/trips/total/${this.props.id}`)
			.then(results => {
				this.setState({budgetTotal: results.data.sum})
				if (this.state.budgetTotal > this.props.budget) {this.setState({alert: 'red'})}
				else {this.setState({alert: null})}
			})
		}
	}

	render () {
		const {budgetTotal, revealed} = this.state
		const {id, budget, getBudgetInput, updateBudget} = this.props
		return (
			<div className="budget-widget" style={{display: 'inline'}}>
				<button
				onClick={() => this.revealWidget()}
				style={{backgroundColor: this.state.alert}}>Budget</button>
				{
					revealed ? 
					<div>
					<h3>Budget Widget</h3>
					<p>Budget: {budget}</p>
					<p>Total Spent: {budgetTotal}</p>
					<input
						onChange={(e) => getBudgetInput(e.target.value)}
						onBlur={() => updateBudget(id)} value={budget}
						type='number'
						min='0'/>
				</div>
				: null}
			</div>
		)
	}
}

export default BudgetWidget