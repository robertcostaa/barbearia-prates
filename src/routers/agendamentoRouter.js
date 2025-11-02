import express from "express";
import {
  listarAgendamentos,
  agendamentosDoMes,
  agendamentosDoDia,
  criarAgendamento,
  cancelarAgendamento,
  concluirAgendamento,
} from "../controllers/agendamentoController.js";

const router = express.Router();

// Rotas públicas
router.get("/", listarAgendamentos);
router.get("/mes", agendamentosDoMes);
router.get("/dia", agendamentosDoDia);
router.post("/", criarAgendamento);

// Rotas de admin/barbeiro
router.patch("/cancelar/:id", cancelarAgendamento);
router.patch("/concluir/:id", concluirAgendamento);

export default router;
