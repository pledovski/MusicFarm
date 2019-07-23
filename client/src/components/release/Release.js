import React, { Fragment, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../../components/layout/Spinner";
import Record from "../../components/release/Record";
import ReleaseItem from "../releases/ReleaseItem";
import { getReleaseById } from "../../actions/release";

const Release = ({ getReleaseById, release: { release, loading }, match }) => {
  useEffect(() => {
    getReleaseById(match.params.id);
  }, [getReleaseById, match.params.id]);
  return loading || release == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <ReleaseItem key={release._id} release={release} />
      <div>
        {release.records.map(record => (
          <Record key={record._id} record={record} />
        ))}
      </div>
    </Fragment>
  );
};

Release.propTypes = {
  getReleaseById: PropTypes.func.isRequired,
  release: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  release: state.release
});

export default connect(
  mapStateToProps,
  { getReleaseById }
)(Release);
