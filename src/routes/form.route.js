const router  = require("express").Router();
const formController = require("../controllers/form.controller");

router.get('/questions/:token', formController.verifyToken, formController.getAllAnswerByStudent)
router.post('/question/:token', formController.verifyToken, formController.getRigthAnswer, formController.insertAnswer);
router.post('/', formController.createFormToken, formController.insertFormToken)
router.get('/:token', formController.verifyToken, formController.getForms);

module.exports = router;