const express = require("express");
const router = express.Router();
const passport = require('passport');
const { forwardAuthenticated } = require("../config/auth");
const STATUS = require("../util/status");
const getPath = require("../util/path");

router.get("/login", forwardAuthenticated, (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.Ok).sendFile(getPath("login.html"));
});

module.exports = router;
