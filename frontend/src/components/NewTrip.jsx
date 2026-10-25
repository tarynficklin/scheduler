import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DEFAULT_COLOR, updateBackground, updateColor } from '../ducks/reducer';
import api, { errorMessage } from '../lib/api';
import { daysBetween } from '../lib/dates';
import { getVibrantColor } from '../lib/palette';
import withRouter from '../lib/withRouter';
import FadeIn from './Common/FadeIn';
import Glass from './Common/Glass';
import './NewTrip.css';

import Budget from './NewTrip/Budget';
import Calendar from './NewTrip/Calendar';
import Header from './NewTrip/Header';
import Location from './NewTrip/Location';

// Used when Unsplash has no photo for the location (or REACT_APP_UAK isn't set).
const FALLBACK_BACKGROUND =
  'https://images.unsplash.com/photo-1518144591331-17a5dd71c477?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=210f0cacd6dd701fe842441652db7be8&auto=format&fit=crop&w=1400&q=80';

// Unsplash photo search with the CRA-era REACT_APP_UAK access key (exposed by Vite's envPrefix).
// Resolves to { background, paletteUrl } for the first result, or null.
async function findPhoto(location) {
  const key = import.meta.env.REACT_APP_UAK;
  if (!key) return null;
  const query = new URLSearchParams({ page: '1', per_page: '10', query: location, client_id: key });
  const res = await fetch(`https://api.unsplash.com/search/photos/?${query}`);
  if (!res.ok) throw new Error(`Unsplash search failed (HTTP ${res.status})`);
  const photo = (await res.json()).results?.[0];
  if (!photo) return null;
  const raw = photo.urls.raw;
  return {
    background: `${raw}&auto=format&fit=crop&w=1400&q=80`,
    paletteUrl: `${raw}&auto=format&w=400&q=60`,
  };
}

class NewTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trip_location: '',
      trip_start_date: '',
      trip_end_date: '',
      trip_budget: 0,
      error: '',
      busy: false,
    };
    this.getBudgetInput = this.getBudgetInput.bind(this);
    this.getLocationInput = this.getLocationInput.bind(this);
    this.getStartDateInput = this.getStartDateInput.bind(this);
    this.getEndDateInput = this.getEndDateInput.bind(this);
  }

  async createTrip() {
    const { trip_location, trip_start_date, trip_end_date, trip_budget, busy } = this.state;
    if (busy) return;

    const location = trip_location.trim();
    const days = daysBetween(trip_start_date, trip_end_date);
    if (!location) return this.setState({ error: 'Where are you going?' });
    if (!days.length)
      return this.setState({ error: 'Pick a start date and an end date on or after it.' });

    this.setState({ busy: true, error: '' });
    try {
      let background = FALLBACK_BACKGROUND;
      let color = DEFAULT_COLOR;
      try {
        const photo = await findPhoto(location);
        if (photo) {
          background = photo.background;
          color = (await getVibrantColor(photo.paletteUrl)) ?? DEFAULT_COLOR;
        }
      } catch (err) {
        console.warn(`No background photo for "${location}": ${err.message}`);
      }

      const { data: rows } = await api.post(`/api/trips`, {
        trip_location: location,
        trip_start_date,
        trip_end_date,
        trip_budget,
        trip_background: background,
        trip_bg_color: color,
      });
      const tripId = rows[0].trip_id;

      this.props.updateBackground(background);
      this.props.updateColor(color);

      for (const day of days) {
        await api.post(`/api/schedule`, { trip_id: tripId, schedule_date: day });
      }
      this.props.navigate(`/trip/${tripId}`);
    } catch (err) {
      this.setState({ busy: false, error: errorMessage(err) });
    }
  }

  getBudgetInput(val) {
    this.setState({ trip_budget: val });
  }
  getLocationInput(val) {
    this.setState({ trip_location: val });
  }
  getStartDateInput(val) {
    this.setState({ trip_start_date: val });
  }
  getEndDateInput(val) {
    this.setState({ trip_end_date: val });
  }

  render() {
    const { getBudgetInput, getLocationInput, getStartDateInput, getEndDateInput } = this;
    const { error, busy } = this.state;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };

    return (
      <FadeIn delay="500" transitionDuration="800">
        <div className="new-trip">
          <Glass
            overlayColor="rgba(255, 255, 255, 0.5)"
            blurAmount="1.6rem"
            className="new-trip-card"
          >
            <Header color={this.props.color} />
            <div
              style={{ backgroundColor: `rgba(${this.props.color}, .20)` }}
              className="new-trip-wrapper"
            >
              <Location getLocationInput={getLocationInput} />
              <Budget getBudgetInput={getBudgetInput} color={this.props.color} />
              <Calendar
                getStartDateInput={getStartDateInput}
                getEndDateInput={getEndDateInput}
                color={this.props.color}
              />
            </div>
            {error ? (
              <p className="new-trip-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              onClick={() => this.createTrip()}
              className="done-button"
              style={themeColor}
              disabled={busy}
              aria-label="Create trip"
            >
              <i className={busy ? 'fas fa-spinner fa-spin' : 'fas fa-check'}></i>
            </button>
          </Glass>
        </div>
      </FadeIn>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.auth.user, color: state.reducer.color };
}
export default withRouter(connect(mapStateToProps, { updateBackground, updateColor })(NewTrip));
