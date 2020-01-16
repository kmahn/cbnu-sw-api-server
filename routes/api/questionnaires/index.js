const { Router } = require('express');
const { isAdmin } = require('../../middlewares');
const controller = require('./controller');

const router = Router();

router.get('/', isAdmin, controller.getQuestionnaires);
router.get('/:id', isAdmin, controller.getQuestionnaire);

module.exports = router;
