import { combineReducers } from "redux";
import alert from './alert'
import post from './post'
import profile from './profile'

export default combineReducers({
  alert,
  post,
  profile
});
