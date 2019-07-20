const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("basedAt", "Please enter the country you are currently based at.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // LEGACY = NO releases
    const {
      realName,
      alias,
      dob,
      bornAt,
      basedAt,
      about,
      website,
      youtube,
      soundcloud,
      facebook,
      instagram
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (realName) profileFields.realName = realName;
    if (alias) profileFields.alias = alias;
    if (dob) profileFields.dob = dob;
    if (bornAt) profileFields.bornAt = bornAt;
    if (basedAt) profileFields.basedAt = basedAt;
    if (about) profileFields.about = about;

    //Build links object
    profileFields.links = {};
    if (website) profileFields.links.website = website;
    if (youtube) profileFields.links.youtube = youtube;
    if (soundcloud) profileFields.links.soundcloud = soundcloud;
    if (facebook) profileFields.links.facebook = facebook;
    if (instagram) profileFields.links.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find()
      .sort({ date: -1 })
      .populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "User does not exist" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile/
// @desc    Delete user/ profile and posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/events
// @desc    Create event
// @access  Private
router.put(
  "/events",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("from", "Start date and time are required")
        .not()
        .isEmpty(),
      check("to", "End date and time are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      location,
      promoGroupName,
      from,
      to,
      description,
      coverArt
    } = req.body;

    const newEvent = {
      title,
      location,
      promoGroupName,
      from,
      to,
      description,
      coverArt
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.events.unshift(newEvent);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/profile/events/:event_id
// @desc    Update event
// @access  Private
router.put(
  "/events/:event_id",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("from", "Start date and time are required")
        .not()
        .isEmpty(),
      check("to", "End date and time are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      location,
      promoGroupName,
      from,
      to,
      description,
      coverArt
    } = req.body;

    const updatedEvent = {
      title,
      location,
      promoGroupName,
      from,
      to,
      description,
      coverArt
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      const updateIndex = profile.events
        .map(item => item.id)
        .indexOf(req.params.event_id);

      if (updateIndex < 0) {
        return res.status(400).send("Event does not found");
      }

      profile.events.splice(updateIndex, 1, updatedEvent);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/events/:event_id
// @desc    Delete event
// @access  Private
router.delete("/events/:event_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.events
      .map(item => item.id)
      .indexOf(req.params.event_id);

    if (removeIndex < 0) {
      return res.status(400).send("Event does not found");
    }

    profile.events.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
