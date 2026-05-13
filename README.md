# ⛪ Igreja Batista Shalom - Plataforma de Gestão Fullstack

Plataforma SaaS profissional para gestão de igrejas, focada em UX premium, escalabilidade e performance.

## 🚀 Stack Tecnológica

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (Arquitetura CSS-first)
- **Shadcn/UI** + **Framer Motion** (Animações Premium)
- **Zustand** (Estado Global) + **React Query** (Cache de Dados)
- **Lucide React** (Ícones)

### Backend
- **NestJS** (Arquitetura Modular)
- **Prisma ORM** + **PostgreSQL**
- **JWT** + **Refresh Token** (Autenticação Segura)
- **RBAC** (Role Based Access Control)
- **Swagger** (Documentação de API)

---

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 20+
- Docker & Docker Compose
- NPM ou Yarn

### 1. Clonar e Instalar
```bash
# Instalar dependências da raiz
npm install
# Instalar dependências do backend e frontend
npm run install:all
```

### 2. Infraestrutura (Banco de Dados)
```bash
# Subir PostgreSQL e Redis via Docker
npm run docker:up
```

### 3. Configurar Backend
Crie um arquivo `.env` na pasta `/backend` baseado no `.env.example`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecclesia_db?schema=public"
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRATION="1h"
REFRESH_TOKEN_SECRET="outra-chave-secreta"
REFRESH_TOKEN_EXPIRATION="7d"
```

Rode as migrações e o seed:
```bash
cd backend
npx prisma db push
npx prisma db seed
```

### 4. Rodar o Projeto
```bash
# Na raiz do projeto
npm run dev:backend   # Porta 3000
npm run dev:frontend  # Porta 5173
```

---

## 👤 Acesso Inicial (Admin)
- **Email:** `admin@shalom.com`
- **Senha:** `admin123`

---

## 🏗️ Arquitetura
O projeto segue padrões **Enterprise-level**:
- **Backend:** Separação por módulos (`auth`, `members`, `cells`, `events`), DTOs para validação, e Guards para proteção de rotas.
- **Frontend:** Estrutura de pastas modular (`pages`, `components`, `layouts`, `services`), serviços desacoplados com Axios Interceptors.

## 📦 Deploy
- **Frontend:** Pronto para Vercel (basta conectar o repositório).
- **Backend:** Recomendado Railway ou Render com banco PostgreSQL gerenciado.

---
Desenvolvido com foco em excelência e performance. 🚀
