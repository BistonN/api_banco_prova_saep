const router = require('express').Router();
const questaoController = require('../controllers/questao.controller');

router.post('/', questaoController.insertQuestao);

module.exports = router;
