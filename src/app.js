import express from "express";
import cors from "cors";
import barbeiroRouter from "./routers/barbeiroRouter.js";
import agendamentoRouter from "./routers/agendamentoRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/barbeiro", barbeiroRouter);
app.use("/agendamentos", agendamentoRouter);

export default app;


