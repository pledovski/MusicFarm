import axios from "axios";
import { setAlert } from "./alert";
import { GET_RELEASE, GET_RELEASES, RELEASE_ERROR } from "./types";

// Get releases
export const getReleases = () => async dispatch => {
  try {
    const res = await axios.get("/api/releases");

    dispatch({
      type: GET_RELEASES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RELEASE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get release
export const getReleaseById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/releases/${id}`);

    dispatch({
      type: GET_RELEASE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RELEASE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get releases by user ID
export const getUserReleases = id => async dispatch => {
  try {
    const res = await axios.get(`/api/releases/user/${id}`);

    dispatch({
      type: GET_RELEASES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RELEASE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
