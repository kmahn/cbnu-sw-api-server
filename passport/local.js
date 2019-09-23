const createErrors = require('http-errors');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      let user = await User.findByUsername(username);
      if (!user) {
        done(createErrors(404, 'user not found'));
      } else if (!user.authenticate(password)) {
        done(createErrors(400, 'invalid password'));
      } else {
        done(null, user);
      }
    } catch (e) {
      done(e);
    }
  }));
};
