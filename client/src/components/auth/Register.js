import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import PropTypes from "prop-types";
import { register, resend } from "../../actions/auth";
import { makeStyles } from "@material-ui/styles";
import AppLogo from "../../img/icon.png";
import Spinner from "../shared/Spinner";

// MUI Stuff
import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress
} from "@material-ui/core";

const useStyles = makeStyles({
  form: {
    textAlign: "center"
  },
  image: {
    width: 50,
    margin: "20px auto 20px auto"
    // height: 75
  },
  pageTitle: {
    margin: "10px auto 10px auto"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  button: {
    margin: 20,
    position: "relative"
  },
  progress: {
    position: "absolute"
  }
});

const Register = ({
  setAlert,
  register,
  resend,
  isAuthenticated,
  isConfirmed,
  loading
}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: ""
  });

  const { email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({ email, password });
    }
  };

  const onClick = async e => {
    e.preventDefault();
    if (!email) {
      setAlert("Please fill in the Email field", "danger");
    } else {
      resend(email);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img className={classes.image} src={AppLogo} alt="logo" />
        <Typography variant="h3" className={classes.pageTitle}>
          Signup
        </Typography>
        <form noValidate onSubmit={e => onSubmit(e)}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={email}
            onChange={e => onChange(e)}
            required
            fullWidth
          />
          <TextField
            id="password2"
            name="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={password}
            onChange={e => onChange(e)}
            minLength="8"
            required
            fullWidth
          />
          <TextField
            id="password"
            name="password2"
            type="password"
            label="Confirm password"
            className={classes.textField}
            value={password2}
            onChange={e => onChange(e)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className={classes.button}
            disabled={loading}
          >
            Sign Up
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          {!isConfirmed && isConfirmed !== null && (
            <Link onClick={e => onClick(e)} email={email} to="#!">
              {" "}
              Resend
            </Link>
          )}
          <br />
          <small>
            Already have an account? <Link to="/signup">Login</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isConfirmed: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isConfirmed: state.auth.isConfirmed
});

export default connect(
  mapStateToProps,
  { setAlert, register, resend }
)(Register);
