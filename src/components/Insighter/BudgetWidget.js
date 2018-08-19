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
		};
	};

	componentWillReceiveProps (props) {this.refreshTotal(props.id, props.budget, this.state.budgetTotal)};

	revealWidget () {
		this.setState({revealed: !this.state.revealed});
		this.refreshTotal(this.props.id, this.props.budget, this.state.budgetTotal);
	}
	
	async refreshTotal (id, budget, budgetTotal) {
		if (id !== 0) {
			axios.get(`/api/trips/total/${id}`)
			.then(results => {
				this.setState({budgetTotal: results.data.sum})
				budgetTotal > budget ? this.setState({alert: 'red'}) : this.setState({alert: null});
			});
		};
	};

	render () {
		const {budgetTotal, revealed} = this.state;
		const {id, budget, getBudgetInput, updateBudget} = this.props;
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};
		return (
			<div className="budget-widget widget" >
				{
					revealed ? 
					<frosted-glass overlay-color={"#ffffff50"} blur-amount="1.6rem" class="widget-card">
						<div>
							<h3>Budget</h3>
							<p>Budget: {budget}</p>
							<p style={{color: this.state.alert}}>Total Spent: {budgetTotal}</p>
							<input
								onChange={(e) => getBudgetInput(e.target.value)}
								onBlur={() => updateBudget(id)} value={budget}
								type='number'
								min='0'/>
					</div>
				</frosted-glass> : null }
				<button	onClick={() => this.revealWidget()} className="widget-button" style={themeColor()}><i class="fas fa-dollar-sign"></i></button>
			</div>
		);
	};
};

export default BudgetWidget;