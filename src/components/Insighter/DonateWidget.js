import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import {onToken} from '../../ducks/stripe';
import './DonateWidget.css';

class DonateWidget extends Component {
	constructor () {
		super ();
		this.state = {
			revealed : false,
		};
	};

	revealWidget () {this.setState({revealed: !this.state.revealed})};

	render () {
		const {revealed} = this.state;
		let themeColor = () => {return {backgroundColor: `rgb(${this.props.color})`}};

		return (
			<div className="donate-widget widget">
				{
					revealed ? 
				<frosted-glass overlay-color="#ffffff70" blur-amount="1.6rem" class="widget-card">
					<h3>Donate $5</h3>
					<StripeCheckout	token={onToken}	stripeKey={process.env.REACT_APP_STRIPE_PUBLIC}	amount={500} />
				</frosted-glass> : null }
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-heart"></i></button>
			</div>
		);
	};
};

export default DonateWidget;