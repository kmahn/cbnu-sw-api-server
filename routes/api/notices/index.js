const { Router } = require('express');
const controller = require('./controller');
const { isAdmin } = require('../../middlewares');
const upload = require('../../../uploader');

const router = Router();

router.get('/', controller.getNotices);
router.get('/:id', controller.getNotice);
router.post('/', isAdmin, controller.createNotice);
router.post('/upload', isAdmin, upload.single('file'), controller.upload);
router.put('/:id', isAdmin, controller.updateNotice);
router.delete('/:id', isAdmin, controller.removeNotice);

module.exports = router;
