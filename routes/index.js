const { Router } = require('express');
const { authenticate } = require("./middlewares");

const router = Router();

router.use(authenticate);
router.use('/auth', require('./auth'));
router.use('/api', require('./api'));

module.exports = router;
