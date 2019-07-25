import axios from "axios";
import { setAlert } from "./alert";
import {GET_PROFILES, GET_PROFILE, PROFILE_ERROR} from "./types"

// Get profile by ID
export const getProfileById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${id}`)
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
      loading: false
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}
