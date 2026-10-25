import React from 'react';
import { connect } from 'react-redux';
import { updateBackground, updateColor } from '../../ducks/reducer';
import { formatLongDate } from '../../lib/dates';
import FadeIn from '../Common/FadeIn';
import Glass from '../Common/Glass';
import './TripCard.css';

function selectTrip(props) {
  const { id, background, color, navigate } = props;
  props.updateBackground(background);
  props.updateColor(color);
  navigate(`/trip/${id}`);
}

function TripCard(props) {
  const { location, startDate, endDate, color } = props;
  return (
    <FadeIn>
      <Glass overlayColor="rgba(255, 255, 255, 0.5)" className="trip-card" onClick={() => selectTrip(props)}>
        <div className="color-strip" style={{ backgroundColor: `rgb(${color})` }}></div>
        <h1>{location}</h1>
        <a>
          {formatLongDate(startDate)} - {formatLongDate(endDate)}
        </a>
      </Glass>
    </FadeIn>
  );
}

export default connect(null, { updateBackground, updateColor })(TripCard);
