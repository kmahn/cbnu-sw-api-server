const { Router } = require('express');
const controller = require('./controller');
const { isAuthenticated } = require('../middlewares');

const router = Router();

router.get('/me', isAuthenticated, controller.getMe);
router.post('/login/admin', controller.loginAdmin);

module.exports = router;
