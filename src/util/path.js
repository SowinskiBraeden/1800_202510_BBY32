const path = require("path");

const getPath = (filename) => {
  return path.join(
    __dirname,
    "../views",
    filename
  )
};

module.exports = getPath;
