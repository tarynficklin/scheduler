import React, { Component } from 'react';
import { connect } from 'react-redux';
import api from '../lib/api';
import withRouter from '../lib/withRouter';
import FadeIn from './Common/FadeIn';
import TripCard from './Dashboard/TripCard';
import UserButton from './Dashboard/UserButton';
import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { tripCards: [] };
  }

  componentDidMount() {
    this.loadTrips();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.user_id !== this.props.user.user_id) this.loadTrips();
  }

  loadTrips() {
    const { user_id } = this.props.user;
    if (!user_id) return;
    api
      .get(`/api/trips/${user_id}`)
      .then((results) => this.setState({ tripCards: results.data }))
      .catch((err) => console.error(err));
  }

  render() {
    const { tripCards } = this.state;
    return (
      <FadeIn>
        <div>
          <div className="user-wrapper">
            <UserButton />
          </div>
          <div className="dashboard">
            {tripCards.map((e) => (
              <TripCard
                key={e.trip_id}
                id={e.trip_id}
                location={e.trip_location}
                startDate={e.trip_start_date}
                endDate={e.trip_end_date}
                background={e.trip_background}
                color={e.trip_bg_color}
                navigate={this.props.navigate}
              />
            ))}
          </div>
        </div>
      </FadeIn>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.auth.user };
}
export default withRouter(connect(mapStateToProps)(Dashboard));
