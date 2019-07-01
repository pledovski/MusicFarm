import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteRelease } from "../../actions/profile";

const Release = ({ release, deleteRelease }) => {
  const releases = release.map(rel => (
    <tr key={rel._id}>
      <td>{rel.artist}</td>
      <td>{rel.title}</td>
      <td>{rel.label}</td>
      <td>{rel.format}</td>
      <td>
        <Moment format="YYYY/MM/DD">{rel.releaseDate}</Moment>
      </td>
      <td>
        <button
          onClick={() => deleteRelease(rel._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Releases</h2>
      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Title</th>
            <th>Label</th>
            <th>Format</th>
            <th>Release date</th>
            <th />
          </tr>
        </thead>
        <tbody>{releases}</tbody>
      </table>
    </Fragment>
  );
};

Release.propTypes = {
  release: PropTypes.array.isRequired,
  deleteRelease: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteRelease }
)(Release);
