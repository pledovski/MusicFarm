const express = require("express");
const config = require("config");
const mongoURI = config.get("mongoURI");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const router = express.Router();

const Record = require("../../models/Record");
const Release = require("../../models/Release");

const app = express();

// Middleware
app.use(methodOverride("_method"));

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

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
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// -------------------------------------------------------------------------------------------------RELEASES----------------------------------------------------------------------------

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

// @route   GET api/releases/user/:user_id/
// @desc    Get all releases by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const releases = await Release.find({ user: req.params.user_id }).sort({
      date: -1
    });

    if (!releases) {
      return res.status(404).json({ msg: "No releases for this artist" });
    }

    res.json(releases);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Release not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET api/releases/:release_id
// @desc    Get release by ID
// @access  Public
router.get("/:release_id", async (req, res) => {
  try {
    const release = await Release.findById(req.params.release_id).sort({
      date: -1
    });
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

// @route   PUT api/releases/:release_id
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

      if (!release) {
        return res.status(404).json({ msg: "Release not found" });
      }

      if (release.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      if (release) {
        //Update
        release = await Release.findOneAndUpdate(
          { _id: req.params.release_id },
          { $set: newRelease },
          { new: true }
        );

        return res.json(release);
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

    res.json({ mdg: "Release deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// -------------------------------------------------------------------------------------------RECORDS-------------------------------------------------------------------------------------------------

// @route   POST api/releases/record/:release_id
// @desc    Upload a record
// @access  Private
router.post(
  "/record/:release_id",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const release = await Release.findById(req.params.release_id);

      if (!release) {
        return res.status(401).json({ msg: "Release not found" });
      }

      if (release.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      // Check if audio
      if (
        req.file.contentType === "audio/mpeg" ||
        req.file.contentType === "audio/x-aiff" ||
        req.file.contentType === "audio/mp4" ||
        req.file.contentType === "audio.wav"
      ) {
        const newRecord = new Record({
          artist: req.body.artist,
          title: req.body.title,
          user: req.user.id,
          release: release.id,
          file: req.file
        });

        release.records.unshift(newRecord);

        await release.save();
        await newRecord.save();

        res.json(release);
      } else {
        gfs.remove(
          { _id: req.file.id, root: "uploads" },
          (err, GridFSBucket) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
          }
        );
        res.status(404).json({
          err: `${req.file.originalname} is not supported format.`
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET /play/:filename
// @desc Stream file
// @access  Public
router.get("/play/:filename", async (req, res) => {
  try {
    await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          msg: "File does not exist"
        });
      }

      // Check if audio
      if (
        file.contentType === "audio/mpeg" ||
        file.contentType === "audio/x-aiff" ||
        file.contentType === "audio/mp4" ||
        file.contentType === "audio.wav"
      ) {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          msg: "Not an audio"
        });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/releases/record/:id/:record_id
// @desc    Delete a record
// @access  Private
router.delete("/record/:release_id/:record_id", auth, async (req, res) => {
  try {
    const release = await Release.findById(req.params.release_id);

    // Make sure record exists
    if (!release) {
      return res.status(404).json({ msg: "Release does not exist" });
    }

    // Pull out record
    const record = release.records.find(
      record => record.id === req.params.record_id
    );

    // Make sure record exists
    if (!record) {
      return res.status(404).json({ msg: "Record does not exist" });
    }

    // Check user
    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Get remove index
    const removeIndex = release.records
      .map(record => record.id)
      .indexOf(req.params.record_id);

    release.records.splice(removeIndex, 1);

    await release.save();

    // const file = record.file.id;

    gfs.remove(
      { _id: record.file.id, root: "uploads" },
      (err, GridFSBucket) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
      }
    );

    res.json(release.records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//-------------------------------------------------------  DELETE CANDIDATE

// // @route GET /files
// // @desc  Display all files in JSON
// router.get("/uploads", (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: "No files exist"
//       });
//     }

//     // Files exist
//     return res.json(files);
//   });
// });

// // @route GET /files/:filename
// // @desc  Get single file object
// router.get("/uploads/:filename", async (req, res) => {
//   await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: "No file exists"
//       });
//     }
//     // File exists
//     return res.json(file);
//   });
// });

// // @route DELETE /files/:id
// // @desc  Delete file
// router.delete("/uploads/:id", (req, res) => {
//   gfs.remove({ _id: req.params.id, root: "uploads" }, (err, GridFSBucket) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }
//     res.json({ message: "File deleted" });
//   });
// });

module.exports = router;
