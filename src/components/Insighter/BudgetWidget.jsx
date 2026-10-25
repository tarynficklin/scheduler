import React, { Component } from 'react';
import api from '../../lib/api';
import Glass from '../Common/Glass';
import './BudgetWidget.css';

class BudgetWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetTotal: 0,
      revealed: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) this.refreshTotal(this.props.id);
  }

  revealWidget() {
    this.refreshTotal(this.props.id);
    this.setState({ revealed: !this.state.revealed });
  }

  refreshTotal(id) {
    if (!id) return;
    api
      .get(`/api/trips/total/${id}`)
      .then((results) => this.setState({ budgetTotal: results.data.sum ?? 0 }))
      .catch((err) => console.error(err));
  }

  render() {
    const { budgetTotal, revealed } = this.state;
    const { id, budget, getBudgetInput, updateBudget } = this.props;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };
    // Red when the schedule items add up to more than the budget.
    const overBudget = Number(budgetTotal) > Number(budget);
    return (
      <div className="budget-widget widget">
        {revealed ? (
          <Glass overlayColor="rgba(255, 255, 255, 0.7)" blurAmount="1.6rem" className="widget-card">
            <div>
              <p>Total spent:</p>
              <h1 style={{ color: overBudget ? 'red' : null }}>{!budgetTotal ? `$0` : `$${budgetTotal}`}</h1>
              <div className="budget-footer" style={themeColor}>
                <input
                  onChange={(e) => getBudgetInput(e.target.value)}
                  onBlur={() => updateBudget(id)}
                  value={budget}
                  type="number"
                  min="0"
                  aria-label="Budget"
                />
              </div>
            </div>
          </Glass>
        ) : null}
        {revealed ? <div className="arrow" style={{ borderTop: `10px solid rgb(${this.props.color})` }}></div> : null}
        <button onClick={() => this.revealWidget()} className="widget-button" style={themeColor} aria-label="Budget">
          <i className="fas fa-dollar-sign"></i>
        </button>
      </div>
    );
  }
}

export default BudgetWidget;
