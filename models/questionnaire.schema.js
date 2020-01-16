const { Schema } = require('mongoose');

const schema = new Schema({
  contents: [Schema.Types.Mixed],
  form: {
    type: Schema.Types.ObjectId,
    ref: 'AppForm',
    required: true,
    index: true,
  }
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

module.exports = schema;
