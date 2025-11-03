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