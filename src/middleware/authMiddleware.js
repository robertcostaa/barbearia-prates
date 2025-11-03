import jwt from "jsonwebtoken";

const SECRET = "barbearia_secret";

// Middleware de autenticação
export const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: "Token não fornecido." });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id; // Armazena o ID do barbeiro na requisição
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido." });
  }
};

// Função para gerar token JWT
export const gerarToken = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: "8h" });
};
