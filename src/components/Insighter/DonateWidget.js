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
			<div className="donate-widget" style={{display: 'inline'}}>
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-heart"></i></button>
				{
					revealed ? 
				<frosted-glass overlay-color="#ffffff50" blur-amount="1.6rem" class="widget-card">
					<StripeCheckout	token={onToken}	stripeKey={process.env.REACT_APP_STRIPE_PUBLIC}	amount={500} />
				</frosted-glass> : null }
			</div>
		);
	};
};

export default DonateWidget;