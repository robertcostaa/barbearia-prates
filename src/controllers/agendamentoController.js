const { lerAgendamentos, salvarAgendamentos } = require("../utils/db");

function verificarDisponibilidade(req, res) {
  const { data, hora } = req.query;
  if (!data || !hora)
    return res.status(400).json({ erro: "Informe data e hora" });

  const agendamentos = lerAgendamentos();
  const existe = agendamentos.find(
    (a) => a.data === data && a.hora === hora && a.status !== "cancelado"
  );
  res.json({ disponivel: !existe });
}

function criarAgendamento(req, res) {
  const { nomeCliente, data, hora, servico } = req.body;
  if (!nomeCliente || !data || !hora || !servico)
    return res
      .status(400)
      .json({ erro: "Campos obrigatórios: nomeCliente, data, hora, servico" });

  const agendamentos = lerAgendamentos();
  const ocupado = agendamentos.find(
    (a) => a.data === data && a.hora === hora && a.status !== "cancelado"
  );
  if (ocupado) return res.status(400).json({ erro: "Horário indisponível" });

  const novo = {
    id: Date.now(),
    nomeCliente,
    data,
    hora,
    servico,
    status: "pendente",
  };
  agendamentos.push(novo);
  salvarAgendamentos(agendamentos);

  res
    .status(201)
    .json({ mensagem: "Agendamento criado com sucesso", agendamento: novo });
}

function listarAgendamentos(req, res) {
  const agendamentos = lerAgendamentos();
  res.json(agendamentos);
}

function concluirAgendamento(req, res) {
  const id = parseInt(req.params.id);
  const agendamentos = lerAgendamentos();
  const agendamento = agendamentos.find((a) => a.id === id);
  if (!agendamento)
    return res.status(404).json({ erro: "Agendamento não encontrado" });

  agendamento.status = "concluido";
  salvarAgendamentos(agendamentos);
  res.json({ mensagem: "Agendamento concluído", agendamento });
}

function cancelarAgendamento(req, res) {
  const id = parseInt(req.params.id);
  const agendamentos = lerAgendamentos();
  const agendamento = agendamentos.find((a) => a.id === id);
  if (!agendamento)
    return res.status(404).json({ erro: "Agendamento não encontrado" });

  agendamento.status = "cancelado";
  salvarAgendamentos(agendamentos);
  res.json({ mensagem: "Agendamento cancelado", agendamento });
}

module.exports = {
  verificarDisponibilidade,
  criarAgendamento,
  listarAgendamentos,
  concluirAgendamento,
  cancelarAgendamento,
};
