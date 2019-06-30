import React from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

const Dashboard = () => {
  var dashStyle = {
    color: 'red',
    fontSize: 60,
    display: 'flex',
    justifyContent: 'space-around',
  }

  return (
    <div>
      <h1 style={dashStyle} ><u>The service is under construction!</u></h1>
      <div className="dashboard"></div>
    </div>
  )
}

Dashboard.propTypes = {

}

export default Dashboard;