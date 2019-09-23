const createErrors = require('http-errors');
const passport = require('passport');
const { signToken } = require('../helpers');
const { User } = require('../../models');

const login = (...roles) => (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    return next(createErrors(400, 'username required'));
  } else if (!password) {
    return next(createErrors(400, 'password required'));
  }

  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (roles.includes(user.role)) {
      return next(createErrors(404, 'user not found'));
    }

    try {
      const token = await signToken(user.profile);
      res.json({ success: true, data: token });
    } catch (e) {
      next(e);
    }
  }, () => {
  })(req, res, next);
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-hashedPassword');
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};

exports.getMe = getMe;
exports.loginAdmin = login('admin');
