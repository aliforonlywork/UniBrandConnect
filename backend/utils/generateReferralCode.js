const crypto = require("crypto");

module.exports = () => {
  return crypto.randomBytes(5).toString("hex");
};