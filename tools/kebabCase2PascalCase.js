const { basename } = require('path');
module.exports = function kebabCase2PascalCase(filename, postfix = null) {
  filename = basename(filename);

  if (postfix && !filename.endsWith(postfix)) {
    throw new Error('invalid file name.');
  }

  return filename.slice(0, -(postfix.length)).split('-')
    .map(chunk => chunk[0].toUpperCase() + chunk.slice(1))
    .join('');
};
