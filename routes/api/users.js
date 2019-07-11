const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenGenerator = require('uuid-token-generator');
const nodemailer = require("nodemailer");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
const Verification = require("../../models/Verification");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if a user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "ps",
        d: "mm"
      });

      user = new User({
        email,
        avatar,
        password
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);

      const verifToken = await tokgen.generate()

      // Create a verification token for this user
      verification = new Verification({
        user: user.id,
        token: verifToken
        // token: await bcrypt.hash(password, salt)
      });

      // Save the verification token
      await verification.save(err => {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }

        // Send the email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "noreply.music.farm@gmail.com",
            pass: "testosteron123!"
          }
        });
        const mailOptions = {
          from: "noreply.music.farm@gmail.com",
          to: user.email,
          subject: "Account Verification Token",
          text:
            `Hello ${user.email}` +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/api/users/verification/" +
            verification.token
        };
        transporter.sendMail(mailOptions, err => {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res
            .status(200)
            .json({
              msg: "A verification email has been sent to " + user.email
            });
        });
      });

      //  CHANGE THIS LOGIC!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // Return jsonwebtoken
      // const payload = {
      //   user: {
      //     id: user.id
      //   }
      // };

      // jwt.sign(
      //   payload,
      //   config.get("jwtSecret"),
      //   { expiresIn: 3600 },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.json({ token });
      //   }
      // );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/users
// @desc    Register user
// @access  Public

router.get("/:token", async (req, res) => {
  try {
  } catch (error) {
    console.log(err.message);
    res.status(500).send("Server error");
  }

  let token = await Verification.findOne({ token: req.params.token });

  if (!token)
    return res.status(400).json({
      errors: [
        {
          msg:
            "We were unable to find a valid token. Your token my have expired."
        }
      ]
    });

  // If we found a token, find a matching user

  let user = await User.findOne({ _id: token.user });

  if (!user)
    return res
      .status(400)
      .send({ msg: "We were unable to find a user for this token." });
  if (user.isVerified)
    return res.status(400).send({
      type: "already-verified",
      msg: "This user has already been verified."
    });

  // Verify and save the user
  user.isVerified = true;
  user.save(function(err) {
    if (err) {
      return res.status(500).json({
        errors: [
          {
            msg: err.message
          }
        ]
      });
    }
    res.status(200).json("The account has been verified. Please log in.");
  });
});

module.exports = router;
