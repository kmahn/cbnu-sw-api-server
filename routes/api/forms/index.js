const { Router } = require('express');
const { isAdmin, isAuthenticated } = require('../../middlewares');
const controller = require('./controller');

const router = Router();

router.get('/', isAdmin, controller.getForms);
router.get('/me', isAuthenticated, controller.getMyForms);
router.get('/open', controller.getOpenForms);
router.get('/:id', controller.getForm);
router.get('/:id/questionnaires', isAdmin, controller.getQuestionnaires);
router.post('/', isAdmin, controller.createForm);
router.post('/:id/submit', controller.submitQuestionnaire);
router.put('/:id', isAdmin, controller.updateForm);
router.patch('/:id/open', isAdmin, controller.setOpen);
router.patch('/:id/response', isAdmin, controller.setResponse);
router.delete('/:id', isAdmin, controller.removeForm);

module.exports = router;
