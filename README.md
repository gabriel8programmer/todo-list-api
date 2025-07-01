<h1 align="center">Lista de tarefas com NodeJS (Atualizando Documentação...)</h1>

<p align="center">
  <a href="#instalação">🚀 Instalação</a> •
  <a href="#rotas">📡 Rotas</a> •
  <a href="#dev">👨‍💻 Dev</a>
</p>

<br/>

<p>
  Esta é uma API simples desenvolvida para fins de aprendizado em backend e construção de APIs utilizando tecnologias modernas com Node.js.
  Ela oferece autenticação tradicional (e-mail e senha) e login social. Usuários podem cadastrar e gerenciar tarefas, enquanto administradores têm controle total sobre os usuários e suas respectivas tarefas.
</p>

Este projeto foi desenvolvido com foco na prática de:

- nodejs e express
- mongodb com mongoose
- testes automatizados
- arquitetura de código
- documentação básica de APIs

<h2>Tecnologias</h2>

[![TypeScript](https://img.shields.io/badge/TypeScript-4323d5.svg?style=for-the-badge&logo=TypeScript&logoColor=white)]()
[![NodeJs](https://img.shields.io/badge/Node.js-4323d5.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Express](https://img.shields.io/badge/Express-4323d5.svg?style=for-the-badge&logo=Express&logoColor=white)]()
[![Mongodb](https://img.shields.io/badge/MongoDB-4323d5.svg?style=for-the-badge&logo=MongoDB&logoColor=white)]()
[![Mongoose](https://img.shields.io/badge/Mongoose-4323d5.svg?style=for-the-badge&logo=Mongoose&logoColor=white)]()
[![Zod](https://img.shields.io/badge/Zod-4323d5.svg?style=for-the-badge&logo=Zod&logoColor=white)]()
[![Swagger](https://img.shields.io/badge/Swagger-4323d5.svg?style=for-the-badge&logo=Swagger&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-4323d5.svg?style=for-the-badge&logo=Docker&logoColor=white)]()
[![Jest](https://img.shields.io/badge/Jest-4323d5.svg?style=for-the-badge&logo=Jest&logoColor=white)]()

<h2 id="instalação">🚀 Instalação</h2>

### ✅ Requisitos

- [Node.js](https://nodejs.org/pt) instalado
- [Docker](https://www.docker.com/products/docker-desktop/) Instalado
- Criar um projeto no [Google Cloud Console](https://cloud.google.com/cloud-console?hl=pt_br) para configurar login com Google (OAuth2)

Para entender como criar e configurar esse projeto, recomendo assistir a este vídeo explicativo:

👉 [Autenticação de uma API node com Google OAuth2 (Youtube)](https://www.youtube.com/watch?v=oAT3blrnm1E)

---

### ⚙️ Passos para instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/gabriel8programmer/todo-list-api
cd todo-list-api
```

#### 2. Rode o [docker compose](https://docs.docker.com/compose/) para criar o container da aplicação:

```bash
docker compose up
```

Ou, se preferir manter o terminal livre.

```bash
docker compose up -d
```

#### 2. Crie o arquivo `.env` com o seguinte formato:

```yaml
# Ambiente de execução (opcional)
NODE_ENV=development

# Porta do servidor (deve ser 3333 para o Swagger funcionar corretamente)
PORT=3333

# URL do MongoDB (configurada no Docker Compose)
MONGODB_URL=mongodb://user:mongodb@mongodb:27017/db-todolist

# Senha experimental para criar um usuário admin para testes
EXPERIMENTAL_ADMIN_PASS=<SUA_SENHA>

# Chave secreta para JWT (obrigatória)
JWT_SECRET_KEY=<SUA_CHAVE>

# Credencial do Google (obrigatória para autenticação com Google)
GOOGLE_AUDIENCE=<SUA_CREDENCIAL_GOOGLE>
```

## 🛰️ Uso da API

A API será executada localmente em:

```
http://localhost:3333
```

---

## 🧪 Testando a API

Você pode testar as rotas utilizando ferramentas como:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)

### ✅ Recomendado: Swagger

Acesse a documentação interativa com Swagger no seguinte endereço:

👉 [`http://localhost:3333/docs`](http://localhost:3333/docs)

Ou acesse a versão de produção no seguinte endereço:

👉 [`https://todo-list-api-yl9j.onrender.com/docs/`](https://todo-list-api-yl9j.onrender.com/docs/)

### 🔁 Alternância entre ambientes (Local e Produção)

⚙️ A própria interface da documentação Swagger permite alternar facilmente entre a versão local e a de produção da API.

Isso é útil para testar endpoints em diferentes ambientes sem precisar sair da documentação.

![image](https://github.com/user-attachments/assets/792c1193-4432-4ab1-bbcf-4415d3d9d9ad)

---

## 🧪 Rodando os testes automatizados

Você pode executar os testes para garantir que a aplicação está funcionando corretamente.  
O projeto conta com testes unitários e de integração.

```bash
npm test
```

<h2 id="rotas">📡 Rotas</h2>

### 🔑 Endpoints de Autenticação

| Método | Rota                        | Descrição                            | Autenticação |
| ------ | --------------------------- | ------------------------------------ | ------------ |
| POST   | `/api/auth/login`           | Faz login com email e senha          | 🔓 Não       |
| POST   | `/api/auth/register`        | Faz registro com nome, email e senha | 🔓 Não       |
| POST   | `/api/auth/verify-email`    | Verifica o email com código          | 🔓 Não       |
| POST   | `/api/auth/forgot-password` | Esqueceu a senha?                    | 🔓 Não       |
| POST   | `/api/auth/reset-password`  | Recupera a senha                     | 🔓 Não       |
| POST   | `/api/auth/social/google`   | Faz login com google                 | 🔓 Não       |

### ✅ Endpoints públicos (requer autenticação com token de cliente ou admin)

| Método | Rota                              | Descrição                                   | Autenticação |
| ------ | --------------------------------- | ------------------------------------------- | ------------ |
| GET    | `/api/users/:id`                  | Obem um usuário pelo seu ID                 | 🔒 Sim       |
| PUT    | `/api/users/:id`                  | Atualiza um usuário pelo seu ID             | 🔒 Sim       |
| DELETE | `/api/users/:id`                  | Remove um usuário pelo seu ID               | 🔒 Sim       |
| GET    | `/api/users/:id/tasks`            | Lista todas as tasks de um usuario          | 🔒 Sim       |
| GET    | `/api/users/:id/tasks/:taskId`    | Obtém uma task de um usuário pelo ID        | 🔒 Sim       |
| POST   | `/api/users/:id/tasks`            | Cria uma nova task relacionado a um usuario | 🔒 Sim       |
| PUT    | `/api/users/:id/tasks/:taskId`    | Atualiza uma task de um usuário pelo ID     | 🔒 Sim       |
| DELETE | `/api/users/:id/tasks/:taskId`    | Remove uma task de um usuário pelo ID       | 🔒 Sim       |
| DELETE | `/api/users/:id/tasks/delete-all` | Remove todas as tasks de um usuário         | 🔒 Sim       |

### 🔐 Endpoints protegidos (requer autenticação com token de admin)

1. Usuários

| Método | Rota                   | Descrição                   | Autenticação |
| ------ | ---------------------- | --------------------------- | ------------ |
| GET    | `/api/admin/users`     | Lista todos os usuários     | 🔒 Sim       |
| GET    | `/api/admin/users/:id` | Obtém um usuário pelo ID    | 🔒 Sim       |
| POST   | `/api/admin/users`     | Cria um novo usuário        | 🔒 Sim       |
| PUT    | `/api/admin/users/:id` | Atualiza um usuário pelo ID | 🔒 Sim       |
| DELETE | `/api/admin/users/:id` | Remove um usuário pelo ID   | 🔒 Sim       |

2. Tasks

| Método | Rota                          | Descrição                     | Autenticação |
| ------ | ----------------------------- | ----------------------------- | ------------ |
| GET    | `/api/admin/tasks`            | Lista todas as tasks          | 🔒 Sim       |
| GET    | `/api/admin/tasks/:taskId`    | Obtem uma task pelo seu ID    | 🔒 Sim       |
| POST   | `/api/admin/tasks`            | Cria uma nova task            | 🔒 Sim       |
| PUT    | `/api/admin/tasks`            | Atualiza uma task pelo seu ID | 🔒 Sim       |
| DELETE | `/api/admin/tasks/:taskId`    | Remove uma task pelo ID       | 🔒 Sim       |
| DELETE | `/api/admin/tasks/delete-all` | Remove todas as tasks         | 🔒 Sim       |

<h2 id="dev">👨‍💻 Desenvolvedor</h2>

<a href="https://portfolio-backend-bay-two.vercel.app/" target="_blank">
  <table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/c4df01b4-a935-4613-9eb9-aaf04d07b296" height="150" /><br />
      <strong>Gabriel Pereira</strong>
    </td>
  </tr>
</table>
</a>

Sinta-se à vontade para entrar em contato em caso de dúvidas, sugestões ou propostas de colaboração!

<br>

<a href="mailto:gabriel8webprogrammer@gmail.com" target="_blank">
  <img src="https://img.shields.io/badge/Gmail-4323d5?style=for-the-badge&logo=gmail&logoColor=white" alt="gmail"/>
</a>

<a href="https://github.com/gabriel8programmer" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-4323d5.svg?style=for-the-badge&logo=GitHub&logoColor=white" alt="Github" />
</a>

<a href="https://www.linkedin.com/in/gabrielwebprogrammer" target="_blank">
  <img src="https://img.shields.io/badge/linkedin-4323d5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin"/>
</a>

<a href="https://portfolio-backend-bay-two.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/Portfolio-4323d5.svg?style=for-the-badge&logo=firefox&logoColor=white" alt="Portfólio" />
</a>
