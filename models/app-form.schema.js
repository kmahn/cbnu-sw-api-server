const { Schema } = require('mongoose');
const autoIncrementPlugin = require('./plugins/auto-increase.plugin');

const formSchema = new Schema({
  label: {
    type: String,
    trim: true
  },
  description: String,
  image: String,
  type: {
    type: String,
    enum: ['single-line', 'multi-line', 'checkbox', 'radio', 'date', 'description', 'image'],
    default: 'single-line'
  },
  options: [String],  // optional
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  }
}, {
  _id: false,
  versionKey: false
});

const sectionSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },
  forms: [formSchema],
}, {
  _id: false,
  versionKey: false
});

const schema = new Schema({
  no: Number,
  title: {
    type: String,
    index: true,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
    ref: 'User',
  },
  sections: [sectionSchema],
  open: {
    type: Boolean,
    index: true,
    default: false,
  },
  response: {
    type: Boolean,
    index: true,
    default: true,
  }
}, {
  timestamps: true
});

schema.statics.findByNo = function (no, cb) {
  return this.findOne({ no }, cb);
};

schema.index({ no: -1 }, { unique: true });
schema.index({ createdAt: -1 });
schema.plugin(autoIncrementPlugin(__filename, 'no'));

module.exports = schema;
