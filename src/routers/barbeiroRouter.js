import express from "express";
import { 
  loginBarbeiro, 
  listarAgendamentosDia, 
  listarAgendamentosMes, 
  cancelarAgendamento, 
  concluirAgendamento 
} from "../controllers/barbeiroController.js";

import {
  listarAgendamentos
} from "../controllers/agendamentoController.js"

const router = express.Router();

// Rotas do barbeiro
router.post("/login", loginBarbeiro);
router.get("/", listarAgendamentos);
router.get("/agendamentos/dia", listarAgendamentosDia);
router.get("/agendamentos/mes", listarAgendamentosMes);
router.patch("/cancelar/:id", cancelarAgendamento);
router.patch("/concluir/:id", concluirAgendamento);

export default router;
