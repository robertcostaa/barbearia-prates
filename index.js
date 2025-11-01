const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { PORT, FRONTEND_PATH, VIEWS_PATH } = require("./config/server");
const agendamentoRoutes = require("./src/routers/agendamentosRouter");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, FRONTEND_PATH)));

// Rotas da API
app.use("/api", agendamentoRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, VIEWS_PATH, "index.html"));
});

app.listen(PORT, () => console.log(`💈 API da Barbearia rodando em http://localhost:${PORT}`));
