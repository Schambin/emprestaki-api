# 📚 Emprestaki API - Sistema de Gestão de Bibliotecas

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

API para gerenciamento de empréstimos de livros, usuários e pagamentos em bibliotecas.

## ✨ Funcionalidades Principais

- **Autenticação JWT** com roles (Leitor/Administrador)
- **CRUD Completo** de Livros e Usuários
- Sistema de **Empréstimos** com controle de status
- **Pagamentos** de multas com histórico
- Validação rigorosa com **Zod**
- Documentação interativa com **Swagger UI**

## 🛠 Stack Tecnológica

| Componente         | Tecnologias                              |
| ------------------ | ---------------------------------------- |
| **Backend**        | Node.js 18+, Express 4.x, TypeScript 5.x |
| **Banco de Dados** | PostgreSQL 15, Prisma ORM 4.x            |
| **Autenticação**   | JWT, bcryptjs                            |
| **Validação**      | Zod 3.x                                  |
| **Infra**          | Docker, Docker Compose                   |
| **Monitoramento**  | PgAdmin                                  |

## 🚀 Começando

### Pré-requisitos

- Docker 23+
- Node.js 18+

### Instalação Rápida (Recomendada)

```bash
git clone https://github.com/Schambin/emprestaki-api.git
cd emprestaki-api
cp .env.example .env
docker-compose up -d

A API estará disponível em: http://localhost:8888
Documentação Swagger: http://localhost:8888/docs
```

### Configuração Manual

```bash
npm install
npx prisma migrate dev
npm run build
npm start
```

## 📚 Documentação da API

Endpoints disponíveis via Swagger UI:
http://localhost:8888/docs

Exemplo de Uso:

```bash

# Autenticação
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@biblioteca.com","password":"SenhaSegura123"}'

# Listar livros
curl -X GET http://localhost:8888/api/books \
  -H "Authorization: Bearer <SEU_TOKEN_JWT>"
```

## 🗃 Esquema do Banco de Dados
### Principais entidades:

- `User`: Gerencia informações de usuários e suas permissões

- `Book`: Controle completo do acervo bibliográfico

- `Loan`: Registro de empréstimos e devoluções

- `Payment`: Histórico de pagamentos de multas

## 🔧 Variáveis de Ambiente

| Variável                     | Descrição                       | Valor Padrão    |
| ---------------------------- | ------------------------------- | --------------- |
| **JWT_SECRET**               | Chave para assinatura de tokens | secret_key      |
| **DATABASE_URL**             | URL de conexão do PostgreSQL    | local           |
| **PGADMIN_DEFAULT_EMAIL**    | Email do PgAdmin                | admin@admin.com |
| **PGADMIN_DEFAULT_PASSWORD** | Senha do PgAdmin                | root            |
