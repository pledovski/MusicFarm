import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from 'react-moment'

const ProfileItem = ({
  profile: {
    user: { _id, avatar },
    realName,
    alias,
    bornAt,
    basedAt,
    dob,
    about
  }
}) => {
  return <div className="profile bg-light">
    <img src={avatar} alt="" className="round-img"/>
    <div>
      <h2>{alias}</h2>
      <p>{realName} from {basedAt}</p>
      <p>Born at {bornAt} in <Moment format='DD/MM/YYYY'>{dob}</Moment></p>
      <p>{about}</p>
      <Link to={`/profile/${_id}`} className="btn btn-primary">
        View Artist
      </Link>
    </div>
  </div>;
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
