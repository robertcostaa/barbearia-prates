const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// --- FUNÇÃO DE LOGIN ---
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  try {
    const barbeiro = await prisma.barbeiro.findUnique({ where: { email } });
    if (!barbeiro || barbeiro.senha !== password) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign({ id: barbeiro.id, nome: barbeiro.nome }, 'seu_segredo_super_secreto', { expiresIn: '8h' });
    res.status(200).json({ message: 'Login bem-sucedido!', token: token, nome: barbeiro.nome });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

// --- FUNÇÃO PARA BUSCAR TODOS OS AGENDAMENTOS ---
const getAllAgendamentos = async (req, res) => {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      orderBy: { data: 'asc' }
    });
    res.status(200).json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar todos os agendamentos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar agendamentos.' });
  }
};

// --- FUNÇÃO PARA BUSCAR AGENDAMENTOS DO DIA ---
const getAgendamentosDia = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const agendamentos = await prisma.agendamento.findMany({
      where: { data: { gte: hoje, lt: amanha } },
      orderBy: { data: 'asc' }
    });
    res.status(200).json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos do dia:', error);
    res.status(500).json({ error: 'Erro interno ao buscar agendamentos.' });
  }
};


const updateAgendamentoStatus = async (req, res) => {
  const { id } = req.params; // Pega o ID do agendamento da URL
  const { status } = req.body; // Pega o novo status ('concluido' ou 'cancelado') do corpo da requisição

  try {
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id: parseInt(id) }, 
      data: { status: status },   
    });
    res.status(200).json(agendamentoAtualizado); // Retorna o agendamento atualizado
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do agendamento.' });
  }
};


module.exports = {
  login,
  getAllAgendamentos,
  getAgendamentosDia,
  updateAgendamentoStatus // <-- ADICIONADO AQUI
};