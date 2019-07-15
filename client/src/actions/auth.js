import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_UNCONFIRMED,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";

import setAuthToken from "../utils/setAuthToken";

// Load user
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register user
export const register = ({ email, password }) => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_UNCONFIRMED,
      payload: res.data
    });

    dispatch(
      setAlert(`A confirmation email has been sent to ${email}`, "success")
    );
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Resend confirmation link
export const resend = email => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post(
      "/api/users/confirmation/resend",
      body,
      config
    );

    dispatch({ type: REGISTER_UNCONFIRMED, payload: res.data });
    dispatch(
      setAlert(`A confirmation email has been sent to ${email}`, "success")
    );
  } catch (err) {
    const errors = err.response.data.errors;
    const isConfirmed = err.response.data.user;
    if (errors && !isConfirmed) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      dispatch({ type: REGISTER_UNCONFIRMED, payload: isConfirmed });
    }
    if (errors && isConfirmed) {
      errors.forEach(error => dispatch(setAlert(error.msg, "success")));
      dispatch({ type: REGISTER_SUCCESS, payload: isConfirmed });
    }
  }
};

// Get confirmation token
export const confirmUser = token => async dispatch => {
  try {
    const res = await axios.get(`/api/users/confirmation/${token}`);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(
      setAlert(
        "Congratulations! Account successfully confirmed! Now you can log in.",
        "success"
      )
    );
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      dispatch({
        type: REGISTER_FAIL
      });
    }
  }
};

// Login user
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    // const isConfirmed = err.response.data.user;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      dispatch({
        type: REGISTER_UNCONFIRMED
      });
    }
  }
};

//Logout / Clear profile
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
