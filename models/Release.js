const mongoose = require("mongoose");

const ReleaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  artist: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false
  },
  format: {
    type: String,
    required: false
  },
  country: {
    type: String
  },
  releaseDate: {
    type: Date,
    default: Date.now,
    required: false
  },
  style: {
    type: String
  },
  description: {
    type: String
  },
  artWork: {},
  records: {}
});

module.exports = Release = mongoose.model('release', ReleaseSchema);
