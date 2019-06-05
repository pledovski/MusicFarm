const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check')

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/me
// @desc    Create or update user profile
// @access  Private
router.post('/', [ auth, [
  check('basedAt', 'Please neter the country you are currently based at.')
    .not()
    .isEmpty()
] ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
// LEGACY = NO RELEASES
  const {
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
  if(dob) profileFields.dob = dob;
  if(bornAt) profileFields.bornAt = bornAt;
  if(basedAt) profileFields.basedAt = basedAt;
  if(about) profileFields.about = about;


  //Build links object
  profileFields.links = {};
  if(website) profileFields.links.website = website;
  if(youtube) profileFields.links.youtube = youtube;
  if(soundcloud) profileFields.links.soundcloud = soundcloud;
  if(facebook) profileFields.links.facebook = facebook;
  if(instagram) profileFields.links.instagram = instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if(profile) {
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
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;