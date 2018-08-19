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
		this.refreshTotal(this.props.id, this.props.budget, this.state.budgetTotal);
		this.setState({revealed: !this.state.revealed});
	}
	
	async refreshTotal (id, budget, budgetTotal) {
		if (id !== 0) {
			axios.get(`/api/trips/total/${id}`)
			.then(results => {
				budgetTotal > budget ? this.setState({alert: 'red'}) : this.setState({alert: null});
				this.setState({budgetTotal: results.data.sum})
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
					<frosted-glass overlay-color={"#ffffff70"} blur-amount="1.6rem" class="widget-card">
						<div>
							<p>Total spent:</p>
							<h1 style={{color: this.state.alert}}>${budgetTotal}</h1>
							<div className="budget-footer" style={themeColor()}>
								<input
									onChange={(e) => getBudgetInput(e.target.value)}
									onBlur={() => updateBudget(id)} value={budget}
									type='number'
									min='0'/>
							</div>
						</div>
				</frosted-glass> : null }
				{revealed ? <div class="arrow" style={{borderTop: `10px solid rgb(${this.props.color})`}}></div> : null}
				<button	onClick={() => this.revealWidget()} className="widget-button" style={themeColor()}><i class="fas fa-dollar-sign"></i></button>
			</div>
		);
	};
};

export default BudgetWidget;