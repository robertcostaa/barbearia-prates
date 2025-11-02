import express from "express";
import { 
  loginBarbeiro, 
  listarAgendamentosDia, 
  listarAgendamentosMes, 
  cancelarAgendamento, 
  concluirAgendamento 
} from "../controllers/barbeiroController.js";

const router = express.Router();

// Rotas do barbeiro/admin
router.post("/login", loginBarbeiro);
router.get("/agendamentos/dia", listarAgendamentosDia);
router.get("/agendamentos/mes", listarAgendamentosMes);
router.patch("/agendamentos/cancelar/:id", cancelarAgendamento);
router.patch("/agendamentos/concluir/:id", concluirAgendamento);

export default router;
