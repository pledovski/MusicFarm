import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getConfirmationToken } from "../../actions/auth";

const Confirmation = ({ getConfirmationToken, user: { isConfirmed }, match }) => {
  useEffect(() => {
    getConfirmationToken(match.params.id);
  }, [getConfirmationToken, match.params.id]);

  console.log(match.params.id);
  return (
    <Fragment>
      {!isConfirmed && isConfirmed === null ? (
        <Spinner />
      ) : (
        <Fragment>Success!</Fragment>
      )}
    </Fragment>
  );
};

Confirmation.propTypes = {
  getConfirmationToken: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { getConfirmationToken }
)(Confirmation);
