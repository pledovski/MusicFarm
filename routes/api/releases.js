// const express = require("express");
// const router = express.Router();
// const { check, validationResult } = require("express-validator/check");
// const auth = require("../../middleware/auth");
// const upload = require("../../config/storage");

// const User = require("../../models/User");
// const Profile = require("../../models/Profile");
// const Record = require("../../models/Record");
// const Release = require("../../models/Release");

// // @route   POST api/releases
// // @desc    Create release
// // @access  Private
// router.post(
//   "/",
//   [
//     auth,
//     [
//       check("artist", "Artist name is required")
//         .not()
//         .isEmpty(),
//       check("title", "Title is required")
//         .not()
//         .isEmpty(),
//       check("label", "Label is required")
//         .not()
//         .isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const {
//       artist,
//       title,
//       label,
//       format,
//       country,
//       releaseDate,
//       uploadDate,
//       style,
//       description,
//       recordLink,
//       artwork
//     } = req.body;

//     const newRelease = {
//       user: req.user.id,
//       artist,
//       title,
//       label,
//       format,
//       country,
//       releaseDate,
//       uploadDate,
//       style,
//       description,
//       recordLink,
//       artwork
//     };

//     try {
//       release = new Release(newRelease);

//       await release.save();

//       res.json(release);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// // @route   GET api/releases
// // @desc    Get all reelases
// // @access  Public
// router.get("/", async (req, res) => {
//   try {
//     const releases = await Release.find().sort({ date: -1 });
//     res.json(releases);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET api/releases/user/:user_id/
// // @desc    Get all releases by user ID
// // @access  Public
// router.get("/user/:user_id", async (req, res) => {
//   try {
//     const releases = await Release.find({ user: req.params.user_id }).sort({
//       date: -1
//     });

//     if (!releases) {
//       return res.status(404).json({ msg: "No releases for this artist" });
//     }

//     res.json(releases);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Release not found" });
//     }
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET api/releases/:release_id
// // @desc    Get release by ID
// // @access  Public
// router.get("/:release_id", async (req, res) => {
//   try {
//     const release = await Release.findById(req.params.release_id).sort({
//       date: -1
//     });
//     if (!release) {
//       return res.status(404).json({ msg: "Release not found" });
//     }

//     res.json(release);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Release not found" });
//     }
//     res.status(500).send("Server Error");
//   }
// });

// // @route   PUT api/releases/:releaseId
// // @desc    Update release
// // @access  Private
// router.put(
//   "/:release_id",
//   [
//     auth,
//     [
//       check("artist", "Artist name is required")
//         .not()
//         .isEmpty(),
//       check("title", "Title is required")
//         .not()
//         .isEmpty(),
//       check("label", "Label is required")
//         .not()
//         .isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const {
//       artist,
//       title,
//       label,
//       format,
//       country,
//       releaseDate,
//       uploadDate,
//       style,
//       description,
//       recordLink,
//       artwork
//     } = req.body;

//     const newRelease = {
//       user: req.user.id,
//       artist,
//       title,
//       label,
//       format,
//       country,
//       releaseDate,
//       uploadDate,
//       style,
//       description,
//       recordLink,
//       artwork
//     };

//     try {
//       let release = await Release.findById(req.params.release_id);

//       if (release.user.toString() !== req.user.id) {
//         return res.status(401).json({ msg: "User not authorized" });
//       }

//       if (release) {
//         //Update
//         release = await Release.findOneAndUpdate(
//           { _id: releaseId },
//           { $set: newRelease },
//           { new: true }
//         );

//         return res.json(release);
//       }
//       if (!release) {
//         return res.status(404).json({ msg: "Release not found" });
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// // @route   DELETE api/releases/:release_id
// // @desc    Delete release
// // @access  Private
// router.delete("/:release_id", auth, async (req, res) => {
//   try {
//     const release = await Release.findById(req.params.release_id);

//     if (!release) {
//       return res.status(404).json({ msg: "Release not found" });
//     }

//     // Check user
//     if (release.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "User not authorized" });
//     }

//     await release.remove();

//     res.json({ mdg: "Release removed" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   POST api/releases/record/:release_id
// // @desc    Upload a record
// // @access  Private
// router.post(
//   "/record/:release_id",
//   auth,
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       const fileId = await req.file.id;
//       const release = await Release.findById(req.params.release_id);

//       if (!release) {
//         return res.status(401).json({ msg: "Release not found" });
//       }

//       if (release.user.toString() !== req.user.id) {
//         return res.status(401).json({ msg: "User not authorized" });
//       }

//       const newRecord = new Record({
//         artist: req.body.artist,
//         title: req.body.title,
//         user: req.user.id,
//         file: fileId
//       });

//       release.records.unshift(newRecord);

//       await release.save();
//       await newRecord.save();

//       res.json(release);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// // @route   DELETE api/releases/record/:id/:record_id
// // @desc    Delete a record
// // @access  Private
// router.delete("/record/:release_id/:record_id", auth, async (req, res) => {
//   try {
//     const release = await Release.findById(req.params.release_id);

//     // Pull out record
//     const record = release.records.find(
//       record => record.id === req.params.record_id
//     );

//     // Make sure record exists
//     if (!record) {
//       return res.status(404).json({ msg: "Record does not exist" });
//     }

//     // Check user
//     if (record.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "User not authorized" });
//     }

//     // Get remove index
//     const removeIndex = release.records
//       .map(record => record.id)
//       .indexOf(req.params.record_id);

//     release.records.splice(removeIndex, 1);

//     await release.save();

//     res.json(release.records);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // -------------------------------------------------------------- DELETE
// const { gfs } = require("../../config/filesDB");

// router.get("/audio/:id", (req, res) => {
//   Record.findOne({ filename: req.params.id }, (err, file) => {
//     // Check if the input is a valid image or not
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: "No file exists"
//       });
//     }

//     // If the file exists then check whether it is an image
//     if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: "Not an image"
//       });
//     }
//   });
// });

// module.exports = router;
