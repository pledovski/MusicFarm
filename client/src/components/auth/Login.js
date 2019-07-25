import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import PropTypes from "prop-types";
import { login, resend } from "../../actions/auth";
import { useTheme } from "@material-ui/styles";
import { makeStyles } from "@material-ui/styles";
import AppLogo from "../../img/icon.png";
import Spinner from "../shared/Spinner";

// MUI Stuff
import { Grid, Typography, TextField, Button } from "@material-ui/core";

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
    marginTop: 20
  }
});

const Login = ({ login, isConfirmed, resend, isAuthenticated }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };

  const onClick = async e => {
    e.preventDefault();
    if (!email) {
      setAlert("Please fill in the Email field", "danger");
    } else {
      resend(email);
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img className={classes.image} src={AppLogo} alt="logo" />
        <Typography variant="h3" className={classes.pageTitle}>
          Login
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
            id="password"
            name="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={password}
            onChange={e => onChange(e)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            Login
          </Button>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login, setAlert }
)(Login);
