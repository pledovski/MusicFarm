import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileReleases = ({
  release: {
    artist,
    title,
    label,
    format,
    country,
    releaseDate,
    uploadDate,
    style,
    description
  }
}) => 
  <div>
    <h3>{artist}</h3>
    <p>
      Relased:{' '}
      <Moment format="DD/MM/YYYY">{releaseDate}</Moment>
    </p>
    <p>
      Uploaded:{' '}
      <Moment format="DD/MM/YYYY">{uploadDate}</Moment>
    </p>
    <p>
      <strong>{title}</strong>
    </p>
    <h4>
      {label}
    </h4>
    <p>
      {format}
    </p>
    <p>
      {format}
    </p>
    <p>
      {format}
    </p>
    <p>
      <strong>{format}</strong>
    </p>
  </div>;


ProfileReleases.propTypes = {
  release: PropTypes.object.isRequired
};

export default ProfileReleases;
