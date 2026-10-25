import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Glass from './Glass';
import './Missing.css';

function Missing({ color }) {
  const themeColor = { backgroundColor: `rgb(${color})` };
  return (
    <div className="missing">
      <Glass overlayColor="rgba(255, 255, 255, 0.5)" blurAmount="1.6rem" className="missing-card">
        <h3>Page not found</h3>
        <Link to="/">
          <button style={themeColor}>Dashboard</button>
        </Link>
      </Glass>
    </div>
  );
}

function mapStateToProps(state) {
  return { color: state.reducer.color };
}
export default connect(mapStateToProps)(Missing);
