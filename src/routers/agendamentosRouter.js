const express = require("express");
const router = express.Router();
const agendamentoController = require("../controllers/agendamentoController");

router.get("/disponibilidade", agendamentoController.verificarDisponibilidade);
router.post("/agendar", agendamentoController.criarAgendamento);
router.get("/agendamentos", agendamentoController.listarAgendamentos);
router.put(
  "/agendamentos/:id/concluir",
  agendamentoController.concluirAgendamento
);
router.put(
  "/agendamentos/:id/cancelar",
  agendamentoController.cancelarAgendamento
);

module.exports = router;
