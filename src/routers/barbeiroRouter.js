const express = require('express');
const router = express.Router();


const barbeiroController = require('../controllers/barbeiroController.js');


router.post('/login', barbeiroController.login);


router.get('/agendamentos/todos', barbeiroController.getAllAgendamentos);


router.get('/agendamentos/dia', barbeiroController.getAgendamentosDia);


router.patch('/agendamentos/:id', barbeiroController.updateAgendamentoStatus);


module.exports = router;