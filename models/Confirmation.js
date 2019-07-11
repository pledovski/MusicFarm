const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expireAfterSeconds: 10
  }
});

module.exports = Confirmation = mongoose.model("confirmation", TokenSchema);