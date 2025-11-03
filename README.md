## Barbearia Prates API

API desenvolvida em **Node.js + Express + Prisma + SQLite**, responsável por gerenciar **agendamentos**, **barbeiro** e **controle de status (concluído, cancelado, etc.)**.

---

### 📁 Estrutura do Projeto

```
barbearia/
├── prisma/
│   └── schema.prisma          # Definição do banco de dados (SQLite)
├── src/
│   ├── controllers/           # Lógica das rotas (Barbeiro, Cliente, etc.)
│   ├── routes/                # Rotas da API
│   ├── app.js                 # Configuração geral da api
│   ├── prisma.js              # Conexão Prisma
│   └── server.js              # Inicialização do servidor
│
├── .env                       # Variáveis de ambiente
├── .gitignore
├── package-lock.json
├── package.json           
├── prisma.config.ts
└── README.md
```

---

### ⚙️ Tecnologias Utilizadas

- **Node.js** (runtime)
- **Express** (framework HTTP)
- **SQLite + Prisma ORM**
- **CORS**
- **Dotenv**

---

### 🚀 Como Rodar Localmente

#### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/robertcostaa/barbearia-prates.git
cd barbearia-prates
```

#### 2️⃣ Instalar dependências
```bash
npm install
```

#### 3️⃣ Criar o banco e gerar o Prisma Client
```bash
npx prisma migrate dev --name init
```

#### 4️⃣ Criar o arquivo `.env`
Crie um arquivo chamado `.env` na raiz do projeto e adicione:

```
DATABASE_URL="file:./dev.db"
PORT=3000
```

#### 5️⃣ Rodar em modo desenvolvimento
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

### 🔐 Rotas Principais da API

#### 🔸 Login do Barbeiro
`POST /barbeiro/login`

#### 🔸 Listar agendamentos
`GET /barbeiro/agendamentos`

#### 🔸 Cancelar agendamento
`PATCH /barbeiro/cancelar/:id`

#### 🔸 Concluir agendamento
`PATCH /barbeiro/concluir/:id`

#### 🔸 Criar agendamento
`POST /agendamentos`
```json
{
  "nomeCliente": "João",
  "telefone": "11999999999",
  "servico": "corte",
  "data": "2025-11-12",
  "hora": "08:00"
}
```

---

### 🧾 Licença
Este projeto é livre para uso educacional e aprendizado.  
