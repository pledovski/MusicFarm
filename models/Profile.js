const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
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
    type: String,
    required: true
  },
  about: {
    bio: String
  },
  release: [
    {
      // LEGACY - required: true doesnt work
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
        required: true
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
        required: false
      },
      uploadDate: {
        type: Date,
        default: Date.now
      },
      style: {
        type: String
      },
      description: {
        type: String
      },
      recordLink: {
        type: String
        // LEGACY - change to required: true after a media server implementation
      },
      artwork: {
        type: String
      },
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
          lenght: String
          // LEGACY - change to required: true after a media server implementation
        }
      ]
    }
  ],
  events: [
    {
      title: {
        type: String,
        required: true
      },
      location: [
        {
          country: {
            type: String
          },
          city: {
            type: String
          },
          venue: {
            type: String
          }
        }
      ],
      promoGroupName: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date,
        required: true
      },
      description: {
        type: String
      },
      coverArt: {
        type: String
      }
    }
  ],
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
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
