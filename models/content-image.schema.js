const { Schema } = require('mongoose');

const schema = new Schema({
  url: {
    type: String,
    unique: true,
  },
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetModel',
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['Notice'],
    index: true,
  }
});

module.exports = schema;
