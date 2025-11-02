import prisma from "../prisma.js";

// Login do barbeiro
export const loginBarbeiro = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ erro: "Campos obrigatórios" });

  try {
    const barbeiro = await prisma.barbeiro.findUnique({ where: { username } });
    if (!barbeiro || barbeiro.password !== password) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }
    res.json({ mensagem: "Login realizado com sucesso", barbeiro });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao realizar login" });
  }
};

// Listar agendamentos do dia
export const listarAgendamentosDia = async (req, res) => {
  try {
    const hoje = new Date();
    const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    const agendamentos = await prisma.agendamento.findMany({
      where: { data: { gte: inicioDia, lt: fimDia } },
      orderBy: { hora: "asc" }
    });

    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar agendamentos do dia" });
  }
};

// Listar agendamentos do mês
export const listarAgendamentosMes = async (req, res) => {
  try {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);

    const agendamentos = await prisma.agendamento.findMany({
      where: { data: { gte: inicioMes, lt: fimMes } },
      orderBy: [{ data: "asc" }, { hora: "asc" }]
    });

    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar agendamentos do mês" });
  }
};

// Cancelar agendamento
export const cancelarAgendamento = async (req, res) => {
  const { id } = req.params;

  try {
    const agendamento = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status: "cancelado" }
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
      where: { id: parseInt(id) },
      data: { status: "concluido" }
    });

    res.json({ mensagem: "Agendamento concluído", agendamento });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao concluir agendamento" });
  }
};
