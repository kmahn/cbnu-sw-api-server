const { Schema } = require('mongoose');
const autoIncrementPlugin = require('./plugins/auto-increase.plugin');

const schema = new Schema({
  no: {
    type: Number,
  },
  title: {
    type: String,
    index: true,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
    ref: 'User'
  },
  content: String,
  hits: {
    type: Number,
    default: 0,
  },
  attachments: [{ type: Schema.Types.ObjectId, ref: 'File', required: true }]
}, {
  timestamps: true
});

schema.index({ no: -1 }, { unique: true });
schema.index({ createdAt: -1 });
schema.plugin(autoIncrementPlugin(__filename, 'no'));

module.exports = schema;
