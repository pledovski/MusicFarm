import React, { Fragment, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../../components/layout/Spinner";
import ReleaseItem from "../../components/releases/ReleaseItem";
import { getReleases } from "../../actions/release";

export const AllReleasesStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
`;

const AllReleases = ({ getReleases, release: { releases, loading } }) => {
  useEffect(() => {
    getReleases();
  }, [getReleases]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Releases</h1>
      <AllReleasesStyled>
        {releases.map(release => (
          <ReleaseItem key={release._id} release={release} />
        ))}
      </AllReleasesStyled>
    </Fragment>
  );
};

AllReleases.propTypes = {
  getReleases: PropTypes.func.isRequired,
  release: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  release: state.release
});

export default connect(
  mapStateToProps,
  { getReleases }
)(AllReleases);
