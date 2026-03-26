const router  = require("express").Router();
const formController = require("../controllers/form.controller");

router.post('/questions/:token', formController.verifyToken, formController.getAllAnswerByStudent)
router.get('/questions', formController.getAllQuestions);
router.post('/question/:token', formController.verifyToken, formController.getRigthAnswer, formController.insertAnswer);
router.post('/', formController.createFormToken, formController.insertFormToken)
router.get('/areas', formController.getAreas);
router.get('/results/:token', formController.verifyToken, formController.getResults);
router.get('/:token', formController.verifyToken, formController.getForms);

module.exports = router;