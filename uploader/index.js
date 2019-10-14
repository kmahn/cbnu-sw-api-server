const multer = require('multer');
const { existsSync } = require('fs');
const mkdirp = require('mkdirp');
const uuidV1 = require('uuid/v1');
const { extname } = require('path');
const { uploads } = require('../config');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!existsSync(uploads)) {
      mkdirp.sync(uploads);
    }
    cb(null, uploads);
  },
  filename: function (req, file, cb) {
    const ext = extname(file.originalname);
    cb(null, `${uuidV1()}${ext}`);
  }
});

module.exports = multer({ storage });
