const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenGenerator = require("uuid-token-generator");
const nodemailer = require("nodemailer");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
const Confirmation = require("../../models/Confirmation");

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

      const confirmationToken = await tokgen.generate();

      // Create a confirmation token for this user
      confirmation = new Confirmation({
        user: user.id,
        token: confirmationToken
      });

      // Save the confirmation token
      await confirmation.save(err => {
        if (err) {
          return res.status(500).json({ errors: [{ msg: err.message }] });
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
          subject: "Account Confirmation Token",
          text:
            `Hello ${user.email}` +
            "Please confirm account creation by clicking the link: \nhttp://" +
            req.headers.host +
            "/api/users/confirmation/" +
            confirmation.token
        };
        transporter.sendMail(mailOptions, err => {
          if (err) {
            return res.status(500).json({ errors: [{ msg: err.message }] });
          }
          res.status(200).json({
            alert: [
              {
                msg: "A confirmation email has been sent to " + user.email
              }
            ]
          });
        });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/users/confirmation/:token
// @desc    Confirm user email
// @access  Public
router.get("/:token", async (req, res) => {
  try {
  } catch (error) {
    console.log(err.message);
    res.status(500).send("Server error");
  }

  let token = await Confirmation.findOne({ token: req.params.token });

  if (!token)
    return res.status(400).json({
      errors: [
        {
          msg:
            "We were unable to find a valid token. Your token may have expired. Want to send the new one?"
        }
      ]
    });

  // If a token found, find a matching user
  let user = await User.findOne({ _id: token.user });

  if (!user)
    return res
      .status(400)
      .send({ msg: "We were unable to find a user for this token." });
  if (user.isConfirmed)
    return res.status(400).send({
      msg: "This user has already been confirmed."
    });

  // Confirm and save the user
  user.isConfirmed = true;
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
    res.status(200).json("Your account has been confirmed. Please log in.");
  });
});

// @route   GET api/users/resend/
// @desc    Confirm user email
// @access  Public
router.post(
  "/confirmation/resend",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // See if a user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      if (user.isConfirmed)
        return res.status(400).send({
          msg: "This account has already been confirmed. Please log in."
        });

      // Create a confirmation token, save it, and send email
      const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);

      const confirmationToken = await tokgen.generate();

      confirmation = new Confirmation({
        user: user.id,
        token: confirmationToken
      });

      // Save the token
      await confirmation.save(function(err) {
        if (err) {
          return res.status(500).json({ errors: { msg: err.message } });
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
          subject: "Account Confirmation Token",
          text:
            `Hello ${user.email}` +
            "Please confirm account creation by clicking the link: \nhttp://" +
            req.headers.host +
            "/api/users/confirmation/" +
            confirmation.token
        };
        transporter.sendMail(mailOptions, err => {
          if (err) {
            return res.status(500).json({ errors: [{ msg: err.message }] });
          }
          res.status(200).json({
            alert: [
              {
                msg: "A confirmation email has been sent to " + user.email
              }
            ]
          });
        });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
