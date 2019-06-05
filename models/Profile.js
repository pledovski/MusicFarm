const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
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
  releases: [
    {
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
        required: true
      },
      country: {
        type: String
      },
      released: {
        type: Date,
        required: true
      },
      style: {
        type: String
      },
      description: {
        type: String
      },
      recordLink: {
        type: String,
        // LEGACY - change to TRUE after media server implementation
      },
      artwork: {
        type: String
      }
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
            type: String,
            required: true
          },
          city: {
            type: String,
            required: true
          },
          venue: {
            type: String,
            required: true
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
  },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);