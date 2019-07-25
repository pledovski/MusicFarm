const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  profile: {
    avatar: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    realName: {
      type: String
    },
    alias: {
      type: String
    },
    dob: {
      type: Date
    },
    bornAt: {
      type: String
    },
    basedAt: {
      type: String
      // required: true
    },
    about: {
      bio: String
    },
    links: {
      website: {
        type: String
      },
      youtube: {
        type: String
      },
      soundcloud: {
        type: String
      },
      facebook: {
        type: String
      },
      instagram: {
        type: String
      }
    }
  }
});

module.exports = User = mongoose.model("user", UserSchema);
