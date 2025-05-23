
<h1 align="center">Lista de tarefas com NodeJS (Documentando...)</h1>

<p align="center">
  <a href="#instalação">🚀 Instalação</a> •
  <a href="#rotas">📡 Rotas</a> •
  <a href="#organização-de-pastas">📁 Organização</a> •
  <a href="#desenvolvedor">👨‍💻 Dev</a>
</p>

<br/>

<p>
  Esta é uma API simples desenvolvida para fins de aprendizado em backend e construção de APIs utilizando tecnologias modernas com Node.js.
  Ela oferece autenticação tradicional (e-mail e senha) e login social. Usuários podem cadastrar e gerenciar tarefas, enquanto administradores têm controle total sobre os usuários e suas respectivas tarefas.
</p>

<h2>Tecnologias</h2>

[![TypeScript](https://img.shields.io/badge/TypeScript-4323d5.svg?style=for-the-badge&logo=TypeScript&logoColor=white)]()
[![NodeJs](https://img.shields.io/badge/Node.js-4323d5.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Express](https://img.shields.io/badge/Express-4323d5.svg?style=for-the-badge&logo=Express&logoColor=white)]()
[![Mongodb](https://img.shields.io/badge/MongoDB-4323d5.svg?style=for-the-badge&logo=MongoDB&logoColor=white)]()
[![Mongoose](https://img.shields.io/badge/Mongoose-4323d5.svg?style=for-the-badge&logo=Mongoose&logoColor=white)]()
[![Zod](https://img.shields.io/badge/Zod-4323d5.svg?style=for-the-badge&logo=Zod&logoColor=white)]()
[![Insomnia](https://img.shields.io/badge/Insomnia-4323d5.svg?style=for-the-badge&logo=Insomnia&logoColor=white)]()
[![Swagger](https://img.shields.io/badge/Swagger-4323d5.svg?style=for-the-badge&logo=Swagger&logoColor=white)]()

<h2 id="instalation">Instalação</h2>

## 🚀 Instalação

### ✅ Requisitos

- [Node.js](https://nodejs.org/pt) instalado
- [MongoDB](https://www.mongodb.com/) instalado localmente (opcional — você pode usar o MongoDB Atlas)
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

#### 2. Crie o arquivo `.env` com o seguinte formato:

Você pode escolher **uma** das formas abaixo para configurar a conexão com o banco de dados:

```env
# PORTA DO SERVIDOR (obrigatória)
# A porta deve ser 3333 para que a documentação interativa da API (Swagger) funcione corretamente.
PORT=3333

# FORMA 1 — Apenas o nome da base (MongoDB local)
MONGODB_DATABASE=mdb_todolist

# FORMA 2 — Usuário e senha personalizados (MongoDB local)
MONGODB_USER=<SEU_USUARIO>
MONGODB_PASSWORD=<SUA_SENHA>
MONGODB_DATABASE=mdb_todolist

# FORMA 3 — MongoDB Atlas
MONGODB_URL=<SUA_URL_ATLAS>

# CHAVE SECRETA PARA JWT (obrigatória)
JWT_SECRET_KEY=<SUA_CHAVE>

# CREDENCIAL DE AUTENTICAÇÃO DO GOOGLE (obrigatória)
GOOGLE_AUDIENCE=<SUA_CREDENCIAL_GOOGLE>
```

> ⚠️ **Atenção:** Use **apenas uma** das formas de conexão com o banco. As demais podem ser deixadas em branco ou removidas.

---

#### 3. Instale as dependências e inicie o servidor

```bash
npm install
npm run dev
```

---

## 🛰️ Uso da API

A API será executada localmente em:

```
http://localhost:PORT
```

Substitua `PORT` pelo valor definido no seu arquivo `.env` (Padrão: `3333` | Obrigatório pra funcionamento do swagger).

---

## 🧪 Testando a API

Você pode testar as rotas utilizando ferramentas como:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)

### ✅ Recomendado: Swagger

Acesse a documentação interativa com Swagger no seguinte endereço:

👉 [`http://localhost:3333/api/docs`](http://localhost:3333/api/docs)

Ou acesse a versão de produção no seguinte endereço:

👉 [`https://todo-list-api-yl9j.onrender.com/api/docs/`](https://todo-list-api-yl9j.onrender.com/api/docs/)

### 🔁 Alternância entre ambientes (Local e Produção)
⚙️ A própria interface da documentação Swagger permite alternar facilmente entre a versão local e a de produção da API.

Isso é útil para testar endpoints em diferentes ambientes sem precisar sair da documentação.

![image](https://github.com/user-attachments/assets/792c1193-4432-4ab1-bbcf-4415d3d9d9ad)

<h2 id="routes">Rotas</h2>

<h2 id="org">Organização de pastas</h2>

<h2 id="dev">Desenvolvedor</h2>
