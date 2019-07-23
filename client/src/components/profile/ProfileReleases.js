import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const ProfileReleases = ({
  release: {
    _id,
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
}) => (
  <Fragment>
    <div>
      <h3>{artist}</h3>
      <p>
        <Link to={`/releases/${_id}`}>
          <strong>{title}</strong>
        </Link>
      </p>
      <p>
        Relased: <Moment format="DD/MM/YYYY">{releaseDate}</Moment>
      </p>
      <p>
        Uploaded: <Moment format="DD/MM/YYYY">{uploadDate}</Moment>
      </p>
      <h4>{label}</h4>
      <p>{format}</p>
      <p>{format}</p>
      <p>{format}</p>
      <p>
        <strong>{format}</strong>
      </p>
    </div>
  </Fragment>
);

ProfileReleases.propTypes = {
  release: PropTypes.object.isRequired
};

export default ProfileReleases;
