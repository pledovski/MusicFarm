import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div className="dash-buttons">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary" /> Edit Profile
      </Link>
      <Link to="/add-release" className="btn btn-light">
        <i className="far fa-play-circle text-primary" /> Add Release
      </Link>
      {/* <Link to="/add-event" className="btn btn-light">
        <i className="fas fa-graduation-cap text-primary" /> Add Event
      </Link> */}
    </div>
  );
};

export default DashboardActions;
