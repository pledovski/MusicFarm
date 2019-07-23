import React, { Fragment, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import ReleaseListItem from "./ReleaseListItem";
import ReleaseItem from "../../components/releases/ReleaseItem";
import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import { getUserReleases } from "../../actions/release";

export const AllReleasesStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 15px;
`;

const Dashboard = ({
  getCurrentProfile,
  getUserReleases,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
  release: { releases }
}) => {
  useEffect(() => {
    getCurrentProfile();
    getUserReleases(user._id);
  }, [getCurrentProfile, getUserReleases]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">My Profile</h1>
      <p className="lead">
        <i className=" fas fa-user" /> Welcome {profile && profile.realName}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <AllReleasesStyled>
            {releases.map(release => (
              <ReleaseListItem key={release._id} release={release} />
            ))}
          </AllReleasesStyled>
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete my account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not setup a profile, please add some info.</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getUserReleases: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  release: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  release: state.release
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, getUserReleases }
)(Dashboard);
