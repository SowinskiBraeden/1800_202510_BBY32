const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const STATUS = require("../util/status");
const getPath = require("../util/path");

router.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.Ok).sendFile(getPath("index.html"));
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.Ok).sendFile(getPath("dashboard.html"));
});

router.get("/dashboard/favourites", ensureAuthenticated, (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.Ok).sendFile(getPath("favourites.html"));
});

router.get("/dashboard/profile", ensureAuthenticated, (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.Ok).sendFile(getPath("profile.html"));
});

router.get("/dashboard/favourites", ensureAuthenticated, (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.Ok).sendFile(getPath("favourites.html"));
});

router.get("/dashboard/listing/:area/:category/:seo/:id/:lat/:lon", ensureAuthenticated, (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.Ok).sendFile(getPath("listing.html"));
});

module.exports = router;
