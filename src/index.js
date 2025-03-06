const express = require('express');
const path = require("path");

const app = express();
const port = 8000;

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.status(200);
  return res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get("/login", (req, res) => {
  res.status(200);
  return res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.get("/dashboard", (req, res) => {
  res.status(200);
  return res.sendFile(path.join(__dirname, '/views/dashboard.html'));
});

app.get("/dashboard/profile", (req, res) => {
res.status(200);
  return res.sendFile(path.join(__dirname, '/views/profile.html'));
});
app.get("/dashboard/favourites", (req, res) => {
  res.status(200);
    return res.sendFile(path.join(__dirname, '/views/favourites.html'));
  });

app.get("*", (req, res) => {
  res.status(404);
  return res.sendFile(path.join(__dirname, '/views/not-found.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
