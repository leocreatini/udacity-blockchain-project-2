// global imports
const sha256 = require('crypto-js/sha256');

// utils
exports.getCurrentTime = () => new Date().getTime().toString().slice(0, -3);

exports.createHash = block => sha256(JSON.stringify(block)).toString();

