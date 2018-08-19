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
					<h3>Donate to the developer?</h3>
					<p>it's going to a good cause...</p>
					<p>seriously!</p>
					<div className="donate-footer" style={themeColor()}>
						<a><i class="fas fa-donate"></i>  Donate</a>
						<StripeCheckout	token={onToken}	stripeKey={process.env.REACT_APP_STRIPE_PUBLIC}	amount={500} />
					</div>
				</frosted-glass> : null }
				{revealed ? <div class="arrow" style={{borderTop: `10px solid rgb(${this.props.color})`}}></div> : null}
				<button onClick={() => this.revealWidget()} style={themeColor()} className="widget-button"><i class="fas fa-heart"></i></button>
			</div>
		);
	};
};

export default DonateWidget;