import express from "express";
import {
  listarAgendamentos,
  criarAgendamento,
} from "../controllers/agendamentoController.js";

const router = express.Router();

// Rotas públicas
router.get("/", listarAgendamentos);
router.post("/", criarAgendamento);

export default router;
