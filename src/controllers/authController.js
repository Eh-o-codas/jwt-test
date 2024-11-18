const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.SECRET_KEY;

const information = {
  "id": "1234567890",
  "nome": "João Silva",
  "email": "joao.silva@example.com",
  "senha": "senhaSuperSecreta123!",
  "cartao_credito": {
    "numero": "4111 1111 1111 1111",
    "data_vencimento": "12/24",
    "cvv": "123"
  },
  "endereco": {
    "rua": "Rua Fictícia, 123",
    "cidade": "Cidade Exemplo",
    "estado": "EX",
    "cep": "12345-678"
  },
  "telefone": "+55 11 98765-4321",
  "data_nascimento": "1990-05-10",
  "historico_medico": {
    "alergias": ["Penicilina", "Amendoim"],
    "condicoes": ["Hipertensão"]
  },
  "autorizacoes": {
    "acesso_bancario": true,
    "acesso_medico": false
  }
}

const bitcoins = {
  "transacao_id": "a3fcb74d3e2d39b9a34b876ab244d6bb3f68e4aef1d012cd9c5a1b6f81f2d0d5",
  "timestamp": "2024-11-18T13:45:30Z",
  "valor": 0.025,
  "moeda": "BTC",
  "endereco_origem": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "endereco_destino": "1KksPfg1kg5g4f4d6Q9fhWGVf7QyLN7gXp",
  "taxa_transacao": 0.0001,
  "status": "confirmada",
  "bloqueio": "0000000000000000000b1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9f0a1b2c3",
  "numero_bloqueio": 687, 
  "blockchain": "Bitcoin",
  "comentarios": "Transação realizada para pagamento de serviços"
}



const login = (request, response) => {
  const { username, password } = request.body;

  if (username === "professor.lucas" && password === "1234") {
    const payload = {
      sub: username,
      name: "Lucas José de Souza",
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
    return response.json({ message: "Login bem-sucedido!", token });
  }

  response.status(401).json({ message: "Credenciais inválidas" });
};

const protectedContent = (request, response) => {
  const token = request.headers["authorization"];

  if (!token) {
    return response.status(403).json({ message: "Token não fornecido" });
  }

  try {
    const bearerToken = token.split(" ")[1];
    const decoded = jwt.verify(bearerToken, secretKey);

    response.json({ message: "Conteúdo protegido acessado!", user: decoded });
  } catch (error) {
    return response.status(403).json({ message: "Token inválido ou expirado" });
  }
};

const medical = (request, response) => {
  const token = request.headers["authorization"];

  if (!token) {
    return response.status(403).json({ message: "Token não fornecido" });
  }

  try {
    response.json({ message: "Conteúdo protegido acessado!", information });
  } catch (error) {
    return response.status(403).json({ message: "Token inválido ou expirado" });
  }
};

const bitcoin = (request, response) => {
  const token = request.headers["authorization"];

  if (!token) {
    return response.status(403).json({ message: "Token não fornecido" });
  }

  try {
    response.json({ message: "Conteúdo protegido acessado!", bitcoins });
  } catch (error) {
    return response.status(403).json({ message: "Token inválido ou expirado" });
  }
};

module.exports = { login, protectedContent, medical, bitcoin };
