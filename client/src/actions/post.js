import axios from "axios";
import { setAlert } from "./alert";
import {GET_POSTS, GET_POST, POST_ERROR} from "./types"

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("api/posts");
    dispatch({
      type: GET_POSTS,
      payload: res.data,
      loading: false
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
