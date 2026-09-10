# ORION — Controle de Demandas

Sistema de controle e acompanhamento de demandas internas desenvolvido para substituir planilhas compartilhadas despadronizadas, proporcionando governança, rastreabilidade de status e identificação automática de prazos expirados.

---

## 1. Sobre o Projeto

Este software foi desenvolvido como resolução do **Case Técnico — Analista Júnior de Tecnologia** da **ORION Soluções em Tecnologia**.

Ele substitui uma planilha de controle operacional (`Controle_Pendencias.xlsx`), eliminando inconsistências de formatação, duplicidades e incertezas sobre responsabilidades e entregas atrasadas.

---

## 2. Funcionalidades Principais

- **Cadastro de Demandas**: Registro com descrição (3 a 500 caracteres), responsável (2 a 100 caracteres), prazo de conclusão e status inicial.
- **Listagem e Filtros Operacionais**:
  - Filtro reativo por status (`Pendente`, `Em andamento`, `Concluída`).
  - Filtro reativo por responsável com lista dinâmica populada pelo banco.
  - Busca textual em tempo real por descrição ou nome do responsável.
- **Edição Completa**: Atualização de qualquer dado da demanda mantendo integridade das regras.
- **Alteração Rápida de Status**: Modal dedicado para transição de estados sem atrito.
- **Identificação de Demandas Atrasadas**:
  - Lógica de negócio derivada: `dueDate < hoje` e `status != COMPLETED`.
  - Demanda concluída **nunca** é marcada como atrasada.
  - Crachá visual em destaque com badge animado.
- **Dashboard Operacional com Recharts**:
  - 5 cards analíticos com métricas em tempo real (`Total`, `Pendentes`, `Em andamento`, `Concluídas`, `Atrasadas`).
  - **Gráfico Donut** de distribuição de status (`Aberto`, `Em andamento`, `Concluído`).
  - **Gráfico de Barras Empilhadas** com volume de demandas por responsável.
  - Tabela com demandas recentes e atalhos rápidos.
- **Visualização Dupla na Tela de Demandas**:
  - **Modo Tabela**: listagem paginada, filtros em tempo real e drawer de edição.
  - **Modo Kanban com Drag and Drop**: colunas dinâmicas (*Aberto*, *Em andamento*, *Concluído*) onde o usuário pode arrastar cards para alterar o status instantaneamente.

---

## 3. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | Tipagem estrita, performance de renderização e DX ágil. |
| **Gráficos** | **Recharts** | Biblioteca declarativa e responsiva para visualização de dados operacionais. |
| **Estilização** | CSS Tokens + Tailwind CSS + Lucide Icons | Design moderno, limpo, responsivo e 100% alinhado ao mockup corporativo. |
| **Gerenciamento de Estado** | **Zustand** | Estado global leve e desacoplado para filtros, visualização (Tabela/Kanban), modais e navegação. |
| **Data Fetching & Cache** | TanStack Query v5 | Cache inteligente, mutações reativas e invalidação automática. |
| **Formulários & Validação** | React Hook Form + Zod | Validação robusta de contratos tanto no cliente quanto na API. |
| **Backend** | Node.js + NestJS + TypeScript | Arquitetura corporativa modular, injeção de dependência e desacoplamento limpo. |
| **Banco de Dados** | **PostgreSQL 16** via **Docker Compose** | Confiabilidade relacional, isolamento em container e portabilidade. |
| **ORM** | Prisma ORM | Modelagem declarativa com migrations e queries tipadas ponta a ponta. |
| **Testes** | Vitest + Supertest + React Testing Library | 18 testes automatizados (16 na API e 2 no Frontend). |

---

## 4. Arquitetura da Solução

O projeto adota uma estrutura em **npm workspaces (Monorepo)**:

```text
orion-controle-demandas/
├── apps/
│   ├── api/                     # Backend NestJS + Prisma + PostgreSQL
│   │   ├── prisma/              # Schema, migrations, seed e PrismaService
│   │   └── src/
│   │       ├── config/          # Variáveis de ambiente validadas via Zod
│   │       ├── common/          # Filters globais e pipes de validação
│   │       ├── modules/demands/ # Módulo Demands (Controller, Service, Repository, Schemas)
│   │       ├── tests/           # Suíte de integração com NestJS TestingModule e Vitest
│   │       ├── app.controller.ts# Endpoint de Health Check
│   │       ├── app.module.ts    # Módulo raiz NestJS
│   │       └── main.ts          # Entry point e bootstrap NestJS
│   │
│   └── web/                     # Frontend React + Vite + Tailwind + Zustand + Recharts
│       └── src/
│           ├── components/      # UI components (Kanban, Table, Charts, Drawer, Toast, etc.)
│           ├── hooks/           # useDemands, useDemandStats, useDemandStatsByResponsible
│           ├── store/           # Zustand stores (demandsStore e uiStore)
│           ├── pages/           # Dashboard e Demands
│           ├── schemas/         # Validação Zod para formulários
│           ├── services/        # Cliente Axios configurado com proxy
│           └── tests/           # Testes de componentes (React Testing Library)
│
├── docker-compose.yml           # Container do PostgreSQL 16
├── package.json                 # Orquestrador raiz com workspaces
├── .env.example                 # Configuração padrão documentada
└── AI_USAGE.md                  # Registro do uso de inteligência artificial
```

---

## 5. Pré-requisitos

- **Node.js**: Versão 18 ou superior (`node -v`)
- **Docker**: Docker ou Docker Desktop com suporte a `docker compose`

---

## 6. Como Executar o Projeto em Menos de 5 Minutos (Guia Rápido)

### 🚀 Método 1: Inicialização Expressa (Recomendado)

Na raiz descompactada do projeto:

```bash
# 1. Instale as dependências (cerca de 1 min)
npm install

# 2. Suba o banco Docker, execute as migrations e carregue o seed (cerca de 15s)
npm run setup

# 3. Inicie a aplicação completa (API + Web simultaneamente)
npm run dev
```

Pronto! Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.

---

### 📋 Método 2: Passo a Passo Detalhado

#### 1. Iniciar o Banco de Dados (PostgreSQL via Docker)
```bash
docker compose up -d
```

#### 2. Instalar as Dependências
```bash
npm install
```

#### 3. Rodar Migrations e Povoar com Dados de Exemplo (Seed)
```bash
npm run db:migrate
npm run db:seed
```

#### 4. Iniciar a Aplicação Completa
```bash
npm run dev
```

Este comando único utiliza `concurrently` para subir simultaneamente:
- **API Backend**: `http://localhost:3333`
- **Interface Web**: `http://localhost:5173`

---

## 7. URLs e Portas de Acesso

| Serviço | URL | Descrição |
|---|---|---|
| **Frontend Web** | [http://localhost:5173](http://localhost:5173) | Interface gráfica com Dashboard e Tela de Demandas |
| **API REST** | [http://localhost:3333](http://localhost:3333) | Servidor NestJS REST |
| **Health Check** | [http://localhost:3333/health](http://localhost:3333/health) | Endpoint de verificação de integridade da API |
| **PostgreSQL** | `localhost:5432` | Banco de dados relacional (`postgres` / `postgres`) |

---

## 8. Execução de Testes e Build

### Testes Automatizados

Para rodar todos os testes de integração do Backend e testes unitários do Frontend:

```bash
npm run test
```

Para rodar isoladamente:
```bash
npm run test:api   # 16 testes de integração da API
npm run test:web   # Testes unitários do Frontend
```

### Build de Produção

```bash
npm run build
```

---

## 9. Decisões Técnicas

1. **Estado "Atrasada" Derivado**: Conforme estipulado no case, nenhuma coluna física de "Atrasada" foi adicionada ao banco de dados. A verificação é calculada dinamicamente com base em `dueDate < hoje` e `status != COMPLETED`.
2. **PostgreSQL com Docker Compose**: Proporciona isolamento completo, garantindo que qualquer avaliador possa inicializar o banco sem necessidade de configurar senhas ou serviços no sistema operacional hospedeiro.
3. **Zustand para Gerenciamento de Estado**: Escolhido pela simplicidade e ausência de boilerplate se comparado a Redux. Mantém os filtros ativos sincronizados entre abas e o controle fluido dos modais de edição.
4. **Sem Tabela de Usuários**: Como o requisito exige apenas o nome do responsável textual e não há especificação de autenticação/login, evitou-se overengineering mantendo a arquitetura alinhada estritamente aos requisitos.

---

## 10. Deploy na Vercel

O projeto está 100% configurado para rodar na **Vercel** de forma unificada (Frontend Vite + Backend NestJS Serverless) ou separada:

### Opção 1: Deploy Unificado (Recomendado — 1 único projeto Vercel)

1. No dashboard da Vercel, clique em **Add New Project** e selecione o repositório `DueDate`.
2. Mantenha o **Root Directory** como a raiz (`./`).
3. Nas **Environment Variables**, adicione:
   - `DATABASE_URL`: String de conexão do seu PostgreSQL em nuvem (ex: [Neon](https://neon.tech), [Supabase](https://supabase.com) ou Vercel Postgres).
4. Clique em **Deploy**.
   - O `vercel.json` na raiz cuidará automaticamente de compilar o frontend estático e expor as rotas `/api/*` através do handler Serverless do NestJS.

### Opção 2: Deploy Separado (Dois projetos na Vercel)

- **Backend NestJS**:
  - Root Directory: `apps/api`
  - Environment Variables: `DATABASE_URL`
- **Frontend Vite**:
  - Root Directory: `apps/web`
  - Environment Variables: `VITE_API_URL=https://sua-api.vercel.app/api`
