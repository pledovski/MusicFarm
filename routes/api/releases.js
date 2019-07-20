const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const config = require("config");
const mongoURI = config.get("mongoURI");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Record = require("../../models/Record");
const Release = require("../../models/Release");

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route   POST api/releases
// @desc    Create release
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("artist", "Artist name is required")
        .not()
        .isEmpty(),
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("label", "Label is required")
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
      artist,
      title,
      label,
      format,
      country,
      releaseDate,
      uploadDate,
      style,
      description,
      recordLink,
      artwork
    } = req.body;

    const newRelease = {
      user: req.user.id,
      artist,
      title,
      label,
      format,
      country,
      releaseDate,
      uploadDate,
      style,
      description,
      recordLink,
      artwork
    };

    try {
      release = new Release(newRelease);

      await release.save();

      res.json(release);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/releases
// @desc    Get all reelases
// @access  Public
router.get("/", async (req, res) => {
  try {
    const releases = await Release.find().sort({ date: -1 });
    res.json(releases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) {
      return res.status(404).json({ msg: "Release not found" });
    }

    res.json(release);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Release not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/releases/:releaseId
// @desc    Update release
// @access  Private
router.put(
  "/:release_id",
  [
    auth,
    [
      check("artist", "Artist name is required")
        .not()
        .isEmpty(),
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("label", "Label is required")
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
      artist,
      title,
      label,
      format,
      country,
      releaseDate,
      uploadDate,
      style,
      description,
      recordLink,
      artwork
    } = req.body;

    const newRelease = {
      user: req.user.id,
      artist,
      title,
      label,
      format,
      country,
      releaseDate,
      uploadDate,
      style,
      description,
      recordLink,
      artwork
    };

    try {
      let release = await Release.findById(req.params.release_id);

      if (release.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      if (release) {
        //Update
        release = await Release.findOneAndUpdate(
          { _id: releaseId },
          { $set: newRelease },
          { new: true }
        );

        return res.json(release);
      }
      if (!release) {
        return res.status(404).json({ msg: "Release not found" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/releases/:release_id
// @desc    Delete release
// @access  Private
router.delete("/:release_id", auth, async (req, res) => {
  try {
    const release = await Release.findById(req.params.release_id);

    if (!release) {
      return res.status(404).json({ msg: "Release not found" });
    }

    // Check user
    if (release.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await release.remove();

    res.json({ mdg: "Release removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/releases/record
// @desc    Upload a record
// @access  Private
router.post(
  "/record/:release_id",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const fileId = await req.file.id;
      const release = await Release.findById(req.params.release_id);

      if (!release) {
        return res.status(401).json({ msg: "Release not found" });
      }

      if (release.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      const newRecord = new Record({
        artist: req.body.artist,
        title: req.body.title,
        user: req.user.id,
        file: fileId
      });

      release.records.unshift(newRecord);

      await release.save();
      await newRecord.save();

      res.json(release);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/releases/record/:id/:record_id
// @desc    Delete a record
// @access  Private
router.delete('/record/:release_id/:record_id', auth, async (req, res) => {
  try {
    const release = await Release.findById(req.params.release_id);

    // Pull out record
    const record = release.records.find(
      record => record.id === req.params.record_id
    );

    // Make sure record exists
    if (!record) {
      return res.status(404).json({ msg: 'Record does not exist' });
    }

    // Check user
    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = release.records
      .map(record => record.id)
      .indexOf(req.params.record_id);

    release.records.splice(removeIndex, 1);

    await release.save();

    res.json(release.records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/releases/:release_id/records
// @desc    Get all records
// @access  Private
router.get("/", (req, res) => {});

// @route   GET api/uploads/:id
// @desc    Get record by ID
// @access  Private
router.get("/:id", (req, res) => {});
module.exports = router;
