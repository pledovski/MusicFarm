import React, { Fragment, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ReleaseListItem from "../dashboard/ReleaseListItem";
import { getProfileById } from "../../actions/profile";
import { getUserReleases } from "../../actions/release";

export const AllReleasesStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 15px;
`;

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  getUserReleases,
  release: { releases },
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
    getUserReleases(match.params.id);
  }, [getProfileById, getUserReleases, match.params.id]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn bn-light">
            Back To List
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                <i className="fas fa-user-edit" /> Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            {profile.bio ? <ProfileAbout profile={profile} /> : <Fragment />}
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Releases</h2>
              {releases.length > 0 && releases !== null ? (
                <Fragment>
                  <AllReleasesStyled>
                    {releases.map(release => (
                      <ReleaseListItem key={release._id} release={release} />
                    ))}
                  </AllReleasesStyled>
                </Fragment>
              ) : (
                <h4>No releases</h4>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  release: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  release: state.release
});

export default connect(
  mapStateToProps,
  { getProfileById, getUserReleases }
)(Profile);
