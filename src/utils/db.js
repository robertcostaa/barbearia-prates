const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/agendamentos.json");

// Criar arquivo vazio se não existir
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

function lerAgendamentos() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function salvarAgendamentos(dados) {
  fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2));
}

module.exports = { lerAgendamentos, salvarAgendamentos };
