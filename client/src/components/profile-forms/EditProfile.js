import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../actions/profile";

const EditProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  const [formData, setFormData] = useState({
    realName: "",
    alias: "",
    dob: "",
    bornAt: "",
    basedAt: "",
    about: "",
    website: "",
    youtube: "",
    soundcloud: "",
    facebook: "",
    instagram: ""
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    getCurrentProfile();

    setFormData({
      realName: loading || !profile.realName ? "" : profile.realName,
      alias: loading || !profile.alias ? "" : profile.alias,
      dob: loading || !profile.dob ? "" : profile.dob,
      bornAt: loading || !profile.bornAt ? "" : profile.bornAt,
      basedAt: loading || !profile.basedAt ? "" : profile.basedAt,
      githubusername:
        loading || !profile.githubusername ? "" : profile.githubusername,
      about: loading || !profile.about ? "" : profile.about,
      website: loading || !profile.links ? "" : profile.links.website,
      youtube: loading || !profile.links ? "" : profile.links.youtube,
      soundcloud: loading || !profile.links ? "" : profile.links.soundcloud,
      facebook: loading || !profile.links ? "" : profile.links.facebook,
      instagram: loading || !profile.links ? "" : profile.links.instagram
    });
  }, [loading, getCurrentProfile]);

  const {
    realName,
    alias,
    dob,
    bornAt,
    basedAt,
    about,
    website,
    youtube,
    soundcloud,
    facebook,
    instagram
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Let's get some information to make your
        profile stand out
      </p>
      <small>* required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Real name"
            name="realName"
            value={realName}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Alias(es)"
            name="alias"
            value={alias}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Please use comma separated values (Moodymann, Jan, Kenny Dixon Jr.,
            Mr. House, Pitch Black City)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="dob"
            value={dob}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Born at"
            name="bornAt"
            value={bornAt}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Based at"
            name="basedAt"
            value={basedAt}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="A short bio about yourself"
            name="about"
            value={about}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
          />
          <small className="form-text">
            For learning purposes Github is used here
          </small>
        </div>

        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light"
          >
            Add Social Network Links
          </button>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fas fa-globe-europe fa-2x" />
              <input
                type="text"
                placeholder="Your Website URL"
                name="website"
                value={website}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x" />
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-soundcloud fa-2x" />
              <input
                type="text"
                placeholder="SoundCloud URL"
                name="soundcloud"
                value={soundcloud}
                onChange={e => onChange(e)}
              />
            </div>

            {/* <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x" />
              <input type="text" placeholder="Twitter URL" name="twitter" />
            </div> */}

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x" />
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x" />
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={e => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(EditProfile));
