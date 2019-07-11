const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
const Verification = require("../../models/Verification");

router.get("/", async (req, res) => res.send('Tested'));

module.exports = router;

