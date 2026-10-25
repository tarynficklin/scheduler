import React, { Component } from 'react';
import Glass from '../Common/Glass';
import './SettingsWidget.css';

class SettingsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealed: false,
      confirmDelete: false,
    };
  }

  revealWidget() {
    this.setState({ revealed: !this.state.revealed });
  }

  render() {
    const { id, location, deleteTrip, getLocationInput, updateLocation } = this.props;
    const { revealed, confirmDelete } = this.state;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };

    return (
      <div className="settings-widget widget">
        {revealed ? (
          <Glass
            overlayColor="rgba(255, 255, 255, 0.7)"
            blurAmount="1.6rem"
            className="widget-card"
          >
            <div>
              <input
                placeholder={location}
                onChange={(e) => getLocationInput(e.target.value)}
                onBlur={() => updateLocation(id)}
                aria-label="Location"
              />
              <div className="delete-button-wrapper" style={themeColor}>
                {!confirmDelete ? (
                  <button
                    onClick={() => this.setState({ confirmDelete: !this.state.confirmDelete })}
                    className="delete-button"
                  >
                    <i className="fas fa-trash-alt"></i> Delete Trip
                  </button>
                ) : null}
              </div>
              {confirmDelete ? (
                <div className="delete-wrapper" style={themeColor}>
                  <button
                    onClick={() => this.setState({ confirmDelete: !this.state.confirmDelete })}
                    className="confirm-button no"
                  >
                    No
                  </button>
                  {/* deleteTrip waits for the delete, then goes back to the dashboard */}
                  <button onClick={() => deleteTrip(id)} className="confirm-button yes">
                    Yes
                  </button>
                  <p>Are you sure you want to delete this trip?</p>
                </div>
              ) : null}
            </div>
          </Glass>
        ) : null}
        {revealed ? (
          <div className="arrow" style={{ backgroundColor: `rgb(${this.props.color})` }}></div>
        ) : null}
        <button
          onClick={() => this.revealWidget()}
          style={themeColor}
          className="widget-button"
          aria-label="Settings"
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    );
  }
}

export default SettingsWidget;
