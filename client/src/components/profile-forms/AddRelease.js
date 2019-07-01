import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addRelease } from "../../actions/profile";

const AddRelease = ({ addRelease, history }) => {
  const [formData, setFormData] = useState({
    artist: '',
    title: '',
    label: '',
    format: '',
    country: '',
    releaseDate: '',
    uploadDate: '',
    style: '',
    description: '',
    recordLink: '',
    artwork: ''
  });

  const {
    artist,
    title,
    label,
    format,
    country,
    releaseDate,
    uploadDate,
    style,
    description,
    recordLink,
    artwork
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Release</h1>
      <p className="lead">
        <i className="fas fa-code-branch" /> Add your release here in order to start selling them
      </p>
      <form className="form" onSubmit={e => {
        e.preventDefault();
        addRelease(formData, history)
      }}>
        <div className="form-group">Artist:
          <input
            type="text"
            placeholder="Artist"
            name="artist"
            value={artist}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">Title:
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">Label:
          <input
            type="text"
            placeholder="Label"
            name="label"
            value={label}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">Format:
          <input
            type="text"
            placeholder="Format"
            name="format"
            value={format}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">Country:
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={country}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">Release date:
          <input
            type="text"
            placeholder="Release date"
            name="releaseDate"
            value={releaseDate}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">Upload date:
          <input
            type="text"
            placeholder="Upload date"
            name="uploadDate"
            value={uploadDate}
            onChange={e => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">Style:
          <input
            type="text"
            placeholder="Style"
            name="style"
            value={style}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">Description:
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={description}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="The audio will be here"
            name="recordLink"
            value={recordLink}
            // onChange={e => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">Drag and Drop the artwork here
          <input
            type="text"
            placeholder="The artwork will be here"
            name="artwork"
            value={artwork}
            // onChange={e => onChange(e)}
            disabled
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

AddRelease.propTypes = {
  addRelease: PropTypes.func.isRequired
};

export default connect(
  null,
  { addRelease }
)(AddRelease);
