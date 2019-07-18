const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const auth = require("../../middleware/auth");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const config = require("config");
const mongoURI = config.get("mongoURI");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Record = require("../../models/Record");

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

// @route   POST api/uploads
// @desc    Upload a record
// @access  Public
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const fileId = await req.file.id;

    const newRecord = new Record({
      artist: req.body.artist,
      title: req.body.title,
      user: req.user.id,
      file: fileId
    });

    const record = await newRecord.save();

    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/uploads
// @desc    Get all files
// @access  Private
router.get("/", (req, res) => {});

// @route   GET api/uploads/:id
// @desc    Get file by ID
// @access  Private
router.get("/:id", (req, res) => {});
module.exports = router;
