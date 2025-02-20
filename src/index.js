const express = require('express');
const path = require("path");

const app = express();
const port = 8000;

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.status(200);
  return res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get("*", (req, res) => {
  res.status(404);
  return res.sendFile(path.join(__dirname, '/views/notfound.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
