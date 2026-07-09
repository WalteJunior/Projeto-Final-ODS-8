# ConectaTalentos

Plataforma de conexão entre profissionais e empresas, desenvolvida como projeto final do Programa Transforma Futuros.

Alinhado ao **ODS 8 da ONU — Trabalho Decente e Crescimento Econômico**.

---

## 🎯 Sobre o projeto

O ConectaTalentos é uma plataforma two-sided que conecta:

- **Profissionais** — buscam vagas de emprego (CLT/PJ) ou oferecem serviços freelancer
- **Empresas** — publicam vagas e contratam prestadores de serviço

**Problema resolvido:** dificuldade de acesso ao mercado de trabalho formal e informal, promovendo inclusão de trabalhadores autônomos, MEIs e pessoas em recolocação profissional.

**Público-alvo:** trabalhadores com 18 anos ou mais e empresas de qualquer porte.

**Impacto esperado:** redução do desemprego, formalização de serviços e geração de renda digna.

---

## 🛠️ Tecnologias utilizadas

### Frontend
- **React JS** — biblioteca para construção de interfaces
- **Vite** — ferramenta de build e servidor de desenvolvimento
- **JavaScript ES6+** — arrow functions, async/await, destructuring, template strings
- **React Router DOM** — navegação entre páginas (SPA)
- **MUI (Material UI)** — componentes de interface (AppBar, Drawer, etc.)
- **CSS puro** — estilização customizada por página

### Backend
- **Java 17** — linguagem principal do backend
- **Spring Boot 3.x** — framework para criação da API REST
- **Spring Data JPA** — acesso e manipulação de dados com Hibernate
- **Maven** — gerenciador de dependências

### Banco de dados
- **MySQL** — banco de dados relacional

### Infraestrutura
- **Docker** — containerização da aplicação *(pendente)*

---

## 📁 Estrutura do projeto

```
ConectaTalentos/          ← Frontend (React + Vite)
├── src/
│   ├── pages/
│   │   ├── login.jsx
│   │   ├── create.jsx
│   │   ├── pessoa/
│   │   │   ├── layout.jsx
│   │   │   ├── vaga.jsx
│   │   │   ├── servico.jsx
│   │   │   ├── perfil.jsx
│   │   │   └── oferecer.jsx
│   │   └── empresa/
│   │       ├── layout_prof.jsx
│   │       ├── perfil_prof.jsx
│   │       ├── servico_prof.jsx
│   │       ├── pub_vaga_prof.jsx
│   │       └── pub_serv_prof.jsx
│   ├── css/              ← CSS por página
│   ├── services/
│   │   └── api.jsx       ← Integração com o backend
│   ├── App.jsx
│   └── main.jsx

Conecta-Talentos-api/     ← Backend (Java + Spring Boot)
└── src/main/java/com/conectatalentos/api/
    ├── controller/       ← Endpoints REST
    ├── model/            ← Entidades JPA
    ├── repository/       ← Interfaces de acesso ao banco
    └── ApiApplication.java
```

---

## 🗄️ Banco de dados

7 tabelas relacionais no MySQL:

| Tabela | Descrição |
|---|---|
| `usuario` | Dados de autenticação (pessoa ou empresa) |
| `pessoa` | Perfil complementar de profissionais |
| `empresa` | Perfil complementar de empresas |
| `vagas` | Vagas publicadas pelas empresas |
| `servicos` | Serviços oferecidos por profissionais |
| `candidaturas` | Candidaturas de pessoas às vagas |
| `contratacoes` | Solicitações de empresas para contratar serviços |

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/cadastro` | Cadastro de usuário (pessoa ou empresa) |
| POST | `/login` | Autenticação e redirecionamento por perfil |
| GET/POST/PUT/DELETE | `/usuarios` | CRUD de usuários |
| GET/POST/PUT/DELETE | `/vagas` | CRUD de vagas |
| GET/POST/PUT/DELETE | `/servicos` | CRUD de serviços |
| GET/POST/PUT/DELETE | `/pessoas` | CRUD de perfis de pessoa |
| GET/POST/PUT/DELETE | `/empresas` | CRUD de perfis de empresa |
| GET/POST/PUT/DELETE | `/candidaturas` | CRUD de candidaturas |
| GET/POST/PUT/DELETE | `/contratacoes` | CRUD de contratações |

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- Java 17+
- MySQL 8+
- Maven

### 1. Banco de dados

```sql
CREATE DATABASE conectawork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Execute o script SQL do banco na pasta `banco/` para criar as tabelas.

### 2. Backend

```bash
cd Conecta-Talentos-api

# Configure src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/conectawork
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# Rode o servidor
./mvnw spring-boot:run
```

API disponível em: `http://localhost:8080`

### 3. Frontend

```bash
cd Conecta-Talentos
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

---

## ✅ Requisitos atendidos

- [x] Banco de dados MySQL com 7 tabelas relacionadas
- [x] API REST em Java (Spring Boot)
- [x] Mínimo de 3 CRUDs completos integrados ao frontend (usuários, vagas, serviços)
- [x] Frontend em ReactJS com componentização
- [x] Integração frontend ↔ backend via Fetch API
- [x] Dois dashboards distintos: pessoa e empresa
- [ ] Docker (pendente)

---

## 🌍 ODS 8 — Trabalho Decente e Crescimento Econômico

> "Promover o crescimento econômico sustentado, inclusivo e sustentável, emprego pleno e produtivo e trabalho decente para todas e todos."

O ConectaTalentos contribui para esta meta ao:

- Facilitar o acesso ao mercado de trabalho formal e informal
- Incluir trabalhadores sem exigência de histórico formal
- Conectar autônomos e MEIs a oportunidades de trabalho digno
- Reduzir barreiras de entrada para pequenas e médias empresas

---

## 👨‍💻 Desenvolvedor

**Walter Junior**  
Ciência da Computação — UNISUAM  
Programa Transforma Futuros — FAETEC
