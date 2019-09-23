const { Router } = require('express');
const multer = require('multer');
const { join, extname } = require('path');
const uuidV1 = require('uuid/v1');
const mkdirp = require('mkdirp');
const controller = require('./controller');
const { isAdmin } = require('../../middlewares');
const env = require('../../../env');

const DIR = join(env.resources, 'notice-images');
mkdirp.sync(DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    cb(null, `${uuidV1()}${ext}`);
  }
});

const upload = multer({ storage });

const router = Router();

router.get('/', controller.getNotices);
router.get('/:id', controller.getNotice);
router.post('/', isAdmin, controller.createNotice);
router.post('/image', isAdmin, upload.single('image'), controller.uploadImage);
router.put('/:id', isAdmin, controller.updateNotice);
router.delete('/:id', isAdmin, controller.removeNotice);

module.exports = router;
