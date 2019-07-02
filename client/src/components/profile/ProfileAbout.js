import React from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({ profile: { alias, about } }) => {
  return ( alias && about && (
    <div className="profile-about bg-light p-2">
      <h2 className="text-primary">{alias}'s Bio</h2>
      <p>
        {about}
      </p>
    </div>
  )

  );
};

ProfileAbout.propTypes = {};

export default ProfileAbout;
