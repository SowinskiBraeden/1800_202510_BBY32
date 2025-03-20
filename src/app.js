const express = require('express');
const path = require("path");
const status = require("./util/status");

const app = express();
const port = 8000;

/*** STATIC FILES ***/
app.use('/static', express.static(path.join(__dirname, 'public')))
require("./api/routes")(app); // Register API routes

/*** ROUTES ***/
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/index.html'));
  return res.status(status.Ok);
});

app.get("/login", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/login.html'));
  return res.status(status.Ok);
});

app.get("/dashboard", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/dashboard.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/favourites", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/favourites.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/signup", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/profile.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/profile", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/profile.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/favourites", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/favourites.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/listing/:area/:category/:seo/:id/:lat/:lon", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/listing.html'));
  return res.status(status.Ok);
});

/*** DEFAULT ***/

app.get("*", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/not-found.html'));
  return res.status(status.NotFound);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
