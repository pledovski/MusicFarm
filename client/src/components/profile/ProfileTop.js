import React from "react";
import PropTypes from "prop-types";

const ProfileTop = ({
  profile: {
    user: { _id, avatar },
    realName,
    alias,
    dob,
    bornAt,
    basedAt,
    about,
    links
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="" />
      <h1 className="large">{realName}</h1>
      <p className="lead">
        aka: <br /> {alias}
      </p>
      <p>
        Based at {basedAt} {bornAt && <span><br/>Originally from {bornAt}</span>}
      </p>
      <div className="icons my-1">
        {links && links.website && (
          <a href={links.website} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-globe fa-2x" />
          </a>
        )}
        {links && links.youtube && (
          <a href={links.youtube} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube fa-2x" />
          </a>
        )}
        {links && links.soundcloud && (
          <a href={links.soundcloud} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-soundcloud fa-2x" />
          </a>
        )}
        {links && links.facebook && (
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook fa-2x" />
          </a>
        )}
        {links && links.instagram && (
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram fa-2x" />
          </a>
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
