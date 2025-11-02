import prisma from "../prisma.js";

// Listar todos os agendamentos
export const listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      orderBy: { data: "asc" },
    });
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar agendamentos" });
  }
};

// Listar agendamentos do mês
export const agendamentosDoMes = async (req, res) => {
  try {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        data: {
          gte: primeiroDiaMes,
          lte: ultimoDiaMes,
        },
      },
      orderBy: { data: "asc" },
    });
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar agendamentos do mês" });
  }
};

// Listar agendamentos do dia
export const agendamentosDoDia = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        data: {
          gte: hoje,
          lt: amanha,
        },
      },
      orderBy: { hora: "asc" },
    });
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar agendamentos do dia" });
  }
};

// Criar agendamento
export const criarAgendamento = async (req, res) => {
  const { nomeCliente, telefone, servico, data, hora } = req.body;

  if (!nomeCliente || !telefone || !servico || !data || !hora) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  const dataHora = new Date(`${data}T${hora}:00`);

  if (dataHora < new Date()) {
    return res.status(400).json({ erro: "Não é permitido marcar horário no passado" });
  }

  try {
    const existente = await prisma.agendamento.findFirst({
      where: { data: dataHora, hora },
    });

    if (existente) {
      return res.status(400).json({ erro: "Horário indisponível" });
    }

    const agendamento = await prisma.agendamento.create({
      data: { nomeCliente, telefone, servico, data: dataHora, hora },
    });

    res.json({ mensagem: "Agendamento criado com sucesso", agendamento });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar agendamento" });
  }
};

// Cancelar agendamento
export const cancelarAgendamento = async (req, res) => {
  const { id } = req.params;
  try {
    const agendamento = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: { status: "cancelado" },
    });
    res.json({ mensagem: "Agendamento cancelado", agendamento });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cancelar agendamento" });
  }
};

// Concluir agendamento
export const concluirAgendamento = async (req, res) => {
  const { id } = req.params;
  try {
    const agendamento = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: { status: "concluido" },
    });
    res.json({ mensagem: "Agendamento concluído", agendamento });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao concluir agendamento" });
  }
};
