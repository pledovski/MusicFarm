import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REGISTER_UNCONFIRMED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isConfirmed: null,
  loading: true,
  user: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_UNCONFIRMED:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        isConfirmed: false,
        loading: false
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...payload,
        isConfirmed: true,
        isAuthenticated: false,
        loading: false
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
  }
};


