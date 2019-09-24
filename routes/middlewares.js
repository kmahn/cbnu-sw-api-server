const createErrors = require('http-errors');
const { verifyToken } = require('./helpers');

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return next(createErrors(401, 'login required'));
  }
  next();
};

const hasRoles = (...roles) => [
  isAuthenticated,
  (req, res, next) => {
    console.log(req.user.role);
    roles.includes(req.user.role) ? next() : next(createErrors(403, 'forbidden'))
  }
];

exports.authenticate = async (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query['access_token'];

  try {
    if (token) {
      req.user = await verifyToken(token);
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }
    delete req.user;
  }
  next();
};

exports.isAuthenticated = isAuthenticated;
exports.hasRoles = hasRoles;
exports.isAdmin = hasRoles('admin');
