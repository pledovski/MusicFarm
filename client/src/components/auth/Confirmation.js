import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import Login from "./Login";
import { confirmUser, resend } from "../../actions/auth";

const Confirmation = ({
  confirmUser,
  resend,
  auth: { isConfirmed },
  alert: { msg },
  match
}) => {
  useEffect(() => {
    confirmUser(match.params.token);
    // resend(email);
  }, [confirmUser, resend, match.params.token]);

  const [formData, setFormData] = useState({
    email: ""
  });

  const { email } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    resend(email);
  };

  return (
    <Fragment>
      {!isConfirmed || isConfirmed === null ? (
        <Fragment>
          <p className="lead">
            <i className="fas fa-user" /> Please enter an email associated with your MusicFarm account. 
          </p>
          <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={e => onChange(e)}
                required
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Resend" />
          </form>
        </Fragment>
      ) : (
        <Login />
      )}
    </Fragment>
  );
};

Confirmation.propTypes = {
  confirmUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  alert: state.alert
});

export default connect(
  mapStateToProps,
  { confirmUser, resend }
)(Confirmation);
