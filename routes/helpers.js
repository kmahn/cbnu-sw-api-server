const createErrors = require('http-errors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, { issuer: process.env.JWT_ISSUER }, (err, decoded) => {
      if (err) {
        const expired = err.name = 'TokenExpiredError';
        reject(createErrors(expired ? 419 : 401, expired ? 'token expired' : 'invalid token'));
      } else {
        resolve(decoded);
      }
    });
  });
};

exports.signToken = payload => {
  const options = { issuer: process.env.JWT_ISSUER };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, options, (err, encoded) => err ? reject(err) : resolve(encoded));
  });
};
