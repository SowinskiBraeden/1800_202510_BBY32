const express = require("express");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = express();

// Passport Config
require('./config/passport')(passport);

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use("/static", express.static(path.join(__dirname, "public")))
app.use("/", require("./routes/index"));
app.use("/api", require("./routes/api"));
app.use("/users", require("./routes/user"));

app.get("*", (req, res) => {
  res.set("Content-Type", "text/html");
  return res.status(STATUS.NotFound).sendFile(path.join(
    __dirname,
    "../views",
    "not-found.html"
  ));
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
