const { Schema } = require('mongoose');
const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const { uploads } = require('../config');
const unlink = promisify(fs.unlink);

const schema = new Schema({
  url: {
    type: String,
    unique: true,
  },
  mimetype: {
    type: String,
  },
  filename: {
    type: String
  },
  originalname: {
    type: String,
  },
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetModel',
  },
  targetModel: {
    type: String,
    enum: ['Notice', null]
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

schema.index({ target: 1, targetModel: 1, createdAt: 1 });

schema.post('deleteOne', { query: false, document: true }, async function (doc) {
  await unlink(join(uploads, doc.filename));
});

module.exports = schema;
