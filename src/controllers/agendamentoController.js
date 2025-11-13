const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAgendamento = async (req, res) => {
  const { nome, telefone, servico, data, horario } = req.body;

  if (!nome || !telefone || !servico || !data || !horario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const novoAgendamento = await prisma.agendamento.create({
      data: {
       
        nomeCliente: nome,         
        telefone: telefone,       
        servico: servico,
        data: new Date(`${data}T${horario}:00`), 
        hora: horario,             
        status: 'agendado',
      },
    });
    res.status(201).json(novoAgendamento);

  } catch (error) {
    
    console.error('Erro ao criar agendamento (validação):', error);
    res.status(500).json({ error: 'Erro interno ao criar agendamento. Verifique o console do servidor.' });
  }
};

module.exports = {
  createAgendamento,
};