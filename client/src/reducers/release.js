import { GET_RELEASE, GET_RELEASES, RELEASE_ERROR } from "../actions/types";

const initialState = {
  releases: [],
  release: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_RELEASE:
      return {
        ...state,
        release: payload,
        loading: false
      };
    case GET_RELEASES:
      return {
        ...state,
        releases: payload,
        loading: false
      };
    case RELEASE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default: 
      return state;
  }
}
