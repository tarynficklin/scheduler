// $5 donation through Stripe Checkout (replaces react-stripe-checkout / legacy Checkout.js).
// The API creates a Checkout Session and returns its URL; Stripe sends the customer
// back to the app, which shows a confirmation (see src/lib/donation.js and App.jsx).
import React, { Component } from 'react';
import api, { errorMessage } from '../../lib/api';
import { startDonation } from '../../lib/donation';
import Glass from '../Common/Glass';
import './DonateWidget.css';

const AMOUNT_CENTS = 500;

class DonateWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealed: false,
      busy: false,
      error: '',
    };
  }

  revealWidget() {
    this.setState({ revealed: !this.state.revealed, error: '' });
  }

  async donate() {
    this.setState({ busy: true, error: '' });
    try {
      await startDonation(api, { amount: AMOUNT_CENTS, tripId: this.props.tripId });
    } catch (err) {
      this.setState({ busy: false, error: errorMessage(err) });
    }
  }

  render() {
    const { revealed, busy, error } = this.state;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };

    return (
      <div className="donate-widget widget">
        {revealed ? (
          <Glass overlayColor="rgba(255, 255, 255, 0.7)" blurAmount="1.6rem" className="widget-card">
            <h3>Donate to the developer?</h3>
            <p>it's going to a good cause...</p>
            <p>seriously!</p>
            {error ? (
              <p className="donate-error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="donate-footer" style={themeColor}>
              <button className="donate-button" onClick={() => this.donate()} disabled={busy}>
                <i className={busy ? 'fas fa-spinner fa-spin' : 'fas fa-donate'}></i> {busy ? 'Opening Stripe...' : 'Donate $5'}
              </button>
            </div>
          </Glass>
        ) : null}
        {revealed ? <div className="arrow" style={{ borderTop: `10px solid rgb(${this.props.color})` }}></div> : null}
        <button onClick={() => this.revealWidget()} style={themeColor} className="widget-button" aria-label="Donate">
          <i className="fas fa-heart"></i>
        </button>
      </div>
    );
  }
}

export default DonateWidget;
