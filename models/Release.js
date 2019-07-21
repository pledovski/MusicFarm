const mongoose = require("mongoose");

const ReleaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  // profile: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "profile"
  // },
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
  date: {
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
  records: [
    {
      artist: {
        type: String,
        required: false
      },
      title: {
        type: String,
        required: false
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
      },
      file: {},
      likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
          },
          // profile: {
          //   type: mongoose.Schema.Types.ObjectId,
          //   ref: 'profiles'
          // }
        }
      ],
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
          },
          // profile: {
          //   type: mongoose.Schema.Types.ObjectId,
          //   ref: 'profiles'
          // },
          text: {
            type: String,
            required: true
          },
          name: {
            type: String
          },
          avatar: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },
      // profile: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'profiles'
      // }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },
      // profile: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'profiles'
      // },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Release = mongoose.model("release", ReleaseSchema);
