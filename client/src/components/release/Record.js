import React from "react";
import PropTypes from "prop-types";

const Record = ({ record: { user, file: {
  filename
} } }) => {
  return <div>
    <div>{user}</div>
    <div>{filename}</div>
  </div>;
};

Record.propTypes = {};

export default Record;
