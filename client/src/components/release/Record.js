import React from "react";
import PropTypes from "prop-types";

const Record = ({ record: { user, file } }) => {
  return <div>
    <div>{user}</div>
    <div>{file}</div>
  </div>;
};

Record.propTypes = {};

export default Record;
