const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
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
    required: false
  },
  lenght: {
    type: String,
    required: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  file: {}
});

module.exports = Record = mongoose.model("record", RecordSchema);
