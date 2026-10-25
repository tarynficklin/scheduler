import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateBackground, updateColor } from '../ducks/reducer';
import api from '../lib/api';
import withRouter from '../lib/withRouter';
import FadeIn from './Common/FadeIn';
import Glass from './Common/Glass';
import './Insighter.css';

import BudgetWidget from './Insighter/BudgetWidget';
import DonateWidget from './Insighter/DonateWidget';
import Header from './Insighter/Header';
import PackingWidget from './Insighter/PackingWidget';
import Schedule from './Insighter/Schedule';
import ScheduleSelector from './Insighter/ScheduleSelector';
import SettingsWidget from './Insighter/SettingsWidget';

const logError = (err) => console.error(err);

class Insighter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trip_id: 0,
      trip_location: '',
      trip_start_date: '1/1/20XX',
      trip_end_date: '1/1/20XX',
      trip_budget: 0,
      trip_background: '',
      trip_bg_color: '155, 155, 155',
      trip_schedule: [],
      current_schedule: 0,
    };
    this.getBudgetInput = this.getBudgetInput.bind(this);
    this.getLocationInput = this.getLocationInput.bind(this);
    this.updateBudget = this.updateBudget.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.scheduleIndex = this.scheduleIndex.bind(this);
    this.deleteTrip = this.deleteTrip.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props.params;
    try {
      const { data: tripData } = await api.get(`/api/trips/trip/${id}`);
      if (!tripData || tripData.user_id !== this.props.user.user_id)
        throw new Error('not your trip');
      this.setState(tripData);
      this.props.updateBackground(tripData.trip_background);
      this.props.updateColor(tripData.trip_bg_color);
    } catch {
      // 404 (no such trip, or someone else's) or a bad id
      this.props.navigate('/404', { replace: true });
      return;
    }
    api
      .get(`/api/schedule/${id}`)
      .then((results) =>
        this.setState({
          trip_schedule: results.data,
          current_schedule: results.data[0]?.schedule_id ?? 0,
        }),
      )
      .catch(logError);
  }

  getBudgetInput(val) {
    this.setState({ trip_budget: val });
  }
  getLocationInput(val) {
    this.setState({ trip_location: val });
  }
  updateBudget(id) {
    api.put(`/api/trips/budget/${id}`, { budget: this.state.trip_budget }).catch(logError);
  }
  updateLocation(id) {
    api.put(`/api/trips/location/${id}`, { location: this.state.trip_location }).catch(logError);
  }
  scheduleIndex(id) {
    this.setState({ current_schedule: id });
  }
  // Waits for the delete before going back, so the dashboard doesn't show the trip again.
  async deleteTrip(id) {
    try {
      await api.delete(`/api/trips/${id}`);
    } catch (err) {
      logError(err);
    }
    this.props.navigate('/');
  }

  render() {
    const {
      trip_id,
      trip_location,
      trip_start_date,
      trip_end_date,
      trip_budget,
      trip_bg_color,
      trip_schedule,
      current_schedule,
    } = this.state;
    const {
      getBudgetInput,
      getLocationInput,
      scheduleIndex,
      updateLocation,
      updateBudget,
      deleteTrip,
    } = this;

    return (
      <FadeIn>
        <div className="insighter">
          <Glass
            overlayColor="rgba(255, 255, 255, 0.5)"
            blurAmount="1.6rem"
            className="insighter-card"
          >
            <div className="trip-info">
              <Header
                location={trip_location}
                startDate={trip_start_date}
                endDate={trip_end_date}
                color={trip_bg_color}
              />
              <ScheduleSelector
                schedule={trip_schedule}
                scheduleIndex={scheduleIndex}
                currentSchedule={current_schedule}
                color={trip_bg_color}
              />
            </div>
            <div className="trip-schedule">
              <Schedule
                schedule={trip_schedule}
                currentSchedule={current_schedule}
                color={trip_bg_color}
              />
            </div>
          </Glass>
          <div className="widget-wrapper">
            <BudgetWidget
              id={trip_id}
              budget={trip_budget}
              getBudgetInput={getBudgetInput}
              updateBudget={updateBudget}
              color={trip_bg_color}
            />
            <PackingWidget id={trip_id} color={trip_bg_color} />
            <DonateWidget tripId={trip_id} color={trip_bg_color} />
            <SettingsWidget
              id={trip_id}
              location={trip_location}
              getLocationInput={getLocationInput}
              updateLocation={updateLocation}
              deleteTrip={deleteTrip}
              color={trip_bg_color}
            />
          </div>
        </div>
      </FadeIn>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.auth.user, background: state.reducer.background };
}
export default withRouter(connect(mapStateToProps, { updateBackground, updateColor })(Insighter));
