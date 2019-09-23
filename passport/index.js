const local = require('./local');
const { User } = require('../models');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(e => done(e));
  });

  local(passport);
};
