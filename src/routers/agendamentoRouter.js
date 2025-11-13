// Usa o "require" em vez de "import"
const express = require('express');
const router = express.Router();

const agendamentoController = require('../controllers/agendamentoController.js');

router.post('/', agendamentoController.createAgendamento);

module.exports = router;