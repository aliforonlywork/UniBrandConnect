const crypto = require("crypto");

module.exports = () => {
  return "CMP-" + crypto.randomBytes(3).toString("hex").toUpperCase();
};