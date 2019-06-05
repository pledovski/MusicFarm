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

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({ msg: 'User does not exist' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile/
// @desc    Delete user/ profile and posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // LEGACY - remove user posts
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/releases
// @desc    Add release
// @access  Private
router.put(
  '/releases', 
  [ 
    auth, 
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('label', 'Label is required')
        .not()
        .isEmpty(),
      check('released', 'Release date is required')
        .not()
        .isEmpty(),
    ] 
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() })
  }

  const {
    title,
    label,
    format,
    country,
    released,
    style,
    description,
    recordLink,
    artwork
  } = req.body;

  const newRelease = {
    title,
    label,
    format,
    country,
    released,
    style,
    description,
    recordLink,
    artwork
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.releases.unshift(newRelease);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/releases/:release_id
// @desc    Delete release
// @access  Private
router.delete('/releases/:release_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.releases.map(item => item.id).indexOf(req.params.release_id);

    console.log(removeIndex);

    if(removeIndex < 0) {
      return res.status(400).send('Release does not found');
    }
    
    profile.releases.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// router.delete('/releases/:release_id', auth, async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id });

//     // Get remove index
//     const removeIndex = profile.releases.map(item => item.id).indexOf(req.params.release_id);

//     profile.releases.splice(removeIndex, 1);

//     await profile.save();

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });


// LEGACY - "edit release" not implemented

module.exports = router;