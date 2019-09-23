const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hashedPassword: String,
  role: {
    type: String,
    enum: ['admin', 'student', 'professor']
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  }
}, {
  timestamps: { createdAt: 'joinedAt', updatedAt: false }
});

schema.virtual('password')
  .set(function (password) {
    this.hashedPassword = bcrypt.hashSync(password, 12);
  });

schema.virtual('profile')
  .get(function () {
    return {
      _id: this._id,
      username: this.username,
      role: this.role,
    }
  });

schema.statics.findByUsername = function (username, cb) {
  return this.findOne({ username }, cb);
};

schema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

module.exports = schema;
