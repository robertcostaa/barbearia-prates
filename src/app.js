// Linha 1: Carrega as variáveis do arquivo .env. ESSENCIAL para o banco de dados.
require('dotenv').config();

// Importações dos pacotes necessários
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importa os arquivos de rotas que criamos
const agendamentoRouter = require('./routers/agendamentoRouter.js');
const barbeiroRouter = require('./routers/barbeiroRouter.js');

// Inicia o aplicativo Express
const app = express();
const PORT = 3000;

// === Middlewares (configurações que rodam em todas as requisições) ===

// Habilita o CORS para permitir a comunicação entre o frontend e o backend
app.use(cors());
// Permite que o servidor entenda requisições com corpo em formato JSON
app.use(express.json());

// Configura o servidor para "servir" arquivos estáticos (HTML, CSS, JS, Imagens)
const publicPath = path.join(__dirname, '..', 'public');
const viewsPath = path.join(__dirname, '..', 'views');
app.use(express.static(publicPath)); // Serve a pasta /public (css, js, img)
app.use(express.static(viewsPath));   // Serve a pasta /views (html)





app.use('/agendamentos', agendamentoRouter);

app.use('/barbeiro', barbeiroRouter);


// Rota principal: se alguém acessar http://localhost:3000/, redireciona para o login.
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// === Inicia o Servidor ===


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse o login em: http://localhost:${PORT}/login.html`);
  console.log(`Acesse a página inicial em: http://localhost:${PORT}/index.html`);
});