const { Types: { ObjectId } } = require('mongoose');
const kebab2Pascal = require('../../tools/kebabCase2PascalCase');

module.exports = (filepath, property, groupProperty) => {
  return schema => {
    schema.pre('save', function (next) {
      const Model = require('../')[kebab2Pascal(filepath, '.schema.js')];
      const where = {};

      if (groupProperty) {
        where[groupProperty] = this[groupProperty];
      }

      Model.find(where).limit(1).sort(`-${property}`)
        .then(entries => {
          this[property] = this[property] || (entries.length === 0 && 1) || entries[0][property] + 1;
          next();
        })
        .catch(err => next(err));
    });
  };
};
