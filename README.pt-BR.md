# SaaS Admin Dashboard

[English](./README.md) | [Português](./README.pt-BR.md)

Um dashboard full-stack para gerenciamento de SaaS, desenvolvido com Next.js, TypeScript, Prisma, PostgreSQL e Auth.js.

A aplicação simula um workspace interno utilizado por uma equipe de SaaS para acompanhar receita, clientes, planos, assinaturas, transações e membros da equipe. O projeto inclui autenticação, permissões baseadas em função, analytics, tabelas reutilizáveis, estados de carregamento e erro, tema escuro e dados de demonstração realistas gerados por seed.

![Visão geral do dashboard](./docs/screenshots/dashboard-light.png)

## Demo Online

**Aplicação online:** [Abrir a demo](https://saas-admin-dashboard-theta.vercel.app)

O projeto inclui contas de demonstração protegidas para que recrutadores e outros visitantes possam testar os três níveis de permissão sem precisar criar dados próprios.

| Função  | Email               | Senha              |
| ------- | ------------------- | ------------------ |
| Admin   | `admin@email.com`   | `AdminDemo2026!`   |
| Manager | `manager@email.com` | `ManagerDemo2026!` |
| User    | `user@email.com`    | `UserDemo2026!`    |

> As contas públicas de demonstração são protegidas contra alterações que poderiam invalidar as credenciais disponibilizadas.

## Funcionalidades

- Dashboard analítico com MRR, ARR, assinaturas ativas, clientes, receita total e transações recentes
- Gráficos de histórico de receita, crescimento de assinaturas, status das assinaturas e assinaturas por plano
- Páginas de equipe, clientes, planos, assinaturas e transações
- Busca, filtros por status, ordenação e paginação nas páginas com maior volume de dados
- Autorização baseada nas funções **Admin**, **Manager** e **User**
- Autenticação por credenciais com Auth.js, senhas com hash e sessões baseadas em JWT
- Acesso a dados isolado por workspace
- Fluxo reutilizável entre API, services e hooks
- Validação de formulários e APIs com Zod
- Skeletons de carregamento, estados vazios, estados de erro, modais de confirmação e feedback com toasts
- Alertas de notificação para condições relevantes de assinaturas e pagamentos
- Temas claro e escuro com layout responsivo
- Banco de dados PostgreSQL com dados SaaS de demonstração realistas

## Permissões por Função

As três funções podem visualizar os dados de negócio, enquanto as ações de gerenciamento são limitadas de acordo com a responsabilidade de cada perfil.

| Permissão                                                     | Admin | Manager | User |
| ------------------------------------------------------------- | :---: | :-----: | :--: |
| Visualizar analytics do dashboard                             |   ✓   |    ✓    |  ✓   |
| Visualizar equipe, clientes, planos, assinaturas e transações |   ✓   |    ✓    |  ✓   |
| Criar/editar membros da equipe                                |   ✓   |    —    |  —   |
| Criar/editar planos                                           |   ✓   |    ✓    |  —   |
| Atualizar status de assinaturas                               |   ✓   |    ✓    |  —   |
| Atualizar configurações pessoais                              |   ✓   |    ✓    |  ✓   |
| Atualizar nome do workspace                                   |   ✓   |    —    |  —   |

A autorização é aplicada no servidor e na camada de API, e não apenas por meio de botões ocultos ou desabilitados na interface.

## Screenshots

### Gerenciamento de Assinaturas

![Gerenciamento de assinaturas](./docs/screenshots/subscriptions.png)

### Tema Escuro

![Dashboard em tema escuro](./docs/screenshots/dashboard-dark.png)

### Autenticação e Contas de Demonstração

![Login e contas de demonstração](./docs/screenshots/login.png)

## Tecnologias

| Área                | Tecnologia                                                |
| ------------------- | --------------------------------------------------------- |
| Framework           | Next.js (App Router)                                      |
| UI                  | React + TypeScript                                        |
| Estilização         | Tailwind CSS + estilos/tokens globais compartilhados      |
| Banco de dados      | PostgreSQL                                                |
| ORM                 | Prisma                                                    |
| Autenticação        | Auth.js / provider de credenciais do NextAuth             |
| Validação           | Zod                                                       |
| Hash de senhas      | bcryptjs                                                  |
| Gráficos            | Recharts com componentes reutilizáveis baseados no Tremor |
| Ícones              | Lucide React + Remix Icon React                           |
| Deploy              | Vercel                                                    |
| Qualidade de código | ESLint + Prettier                                         |

## Domínio da Aplicação

O dashboard separa as pessoas que **utilizam o sistema administrativo** dos clientes que **compram o produto SaaS**.

```text
Workspace
├── Membros da Equipe (Users)
├── Clientes
│   └── Assinaturas
│       ├── Plano
│       └── Transações
├── Planos
├── Assinaturas
└── Transações
```

- **Membros da Equipe** são usuários internos do dashboard e possuem uma função Admin, Manager ou User.
- **Clientes** representam clientes/contatos do SaaS e podem estar associados a uma empresa.
- **Planos** definem os níveis disponíveis de assinatura mensal.
- **Assinaturas** conectam clientes aos planos e registram o status atual da assinatura.
- **Transações** representam eventos individuais de pagamento, como Paid, Pending, Failed ou Refunded.

## Arquitetura

O fluxo de dados no lado do cliente foi separado em responsabilidades menores:

```text
Página / UI
   ↓
Custom Hook
   ↓
Service
   ↓
API Route
   ↓
Prisma
   ↓
PostgreSQL
```

Por exemplo, uma página utiliza um custom hook para gerenciar os estados de dados, carregamento e erro. O hook chama um service, o service envia uma requisição HTTP para um Route Handler do Next.js e a rota da API realiza a autorização e acessa o PostgreSQL por meio do Prisma.

A autenticação segue um fluxo separado no servidor utilizando Auth.js. As páginas protegidas verificam a sessão autenticada, enquanto as rotas de API utilizam helpers reutilizáveis para autenticação e autorização, como verificações de usuário autenticado, acesso exclusivo de Admin e acesso de Manager ou Admin.

## Métricas do Dashboard

As métricas do Dashboard são calculadas a partir dos dados do banco, em vez de utilizar valores fixos na interface.

- **MRR** — soma dos valores mensais das assinaturas atualmente ativas
- **ARR** — receita recorrente anualizada calculada a partir do MRR atual (`MRR × 12`)
- **Assinaturas Ativas** — assinaturas atualmente com status Active
- **Clientes** — total de clientes no workspace atual
- **Receita Total** — soma das transações com status Paid
- **Receita ao Longo do Tempo** — receita de pagamentos concluídos agrupada por mês
- **Crescimento de Assinaturas** — evolução da quantidade de assinaturas ao longo do tempo

## Estrutura do Projeto

Abaixo estão apenas as principais áreas da aplicação.

```text
saas-admin-dashboard/
├── docs/
│   └── screenshots/       # Screenshots utilizados no README
│
├── prisma/
│   ├── migrations/        # Histórico de alterações do schema
│   ├── schema.prisma      # Modelos e relações do banco
│   └── seed.ts            # Dados realistas de demonstração
│
├── public/                # Arquivos estáticos
│
├── src/
│   ├── app/               # Páginas, layouts, Server Actions e rotas de API
│   ├── components/        # Componentes de UI e funcionalidades reutilizáveis
│   ├── constants/         # Valores fixos e regras de validação compartilhados
│   ├── contexts/          # Contexto React compartilhado
│   ├── generated/         # Prisma Client gerado automaticamente (não versionado)
│   ├── hooks/             # Lógica React reutilizável
│   ├── lib/               # Infraestrutura e helpers compartilhados
│   ├── services/          # Comunicação com APIs
│   ├── types/             # Tipos TypeScript compartilhados
│   ├── utils/             # Funções utilitárias específicas
│   ├── auth.ts            # Configuração do Auth.js
│   └── proxy.ts           # Controle de autenticação para rotas selecionadas
│
├── .env                   # Variáveis de ambiente locais (não versionado)
├── package.json
└── README.md
```

## Como Executar Localmente

### Pré-requisitos

Para executar o projeto localmente, você precisa de:

- Node.js e npm
- Um banco de dados PostgreSQL

### 1. Clonar o repositório

```bash
git clone https://github.com/Matheus-mff/saas-admin-dashboard.git
cd saas-admin-dashboard
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="YOUR_AUTH_SECRET"
```

Não envie seu arquivo `.env` real nem segredos de produção para o GitHub.

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

### 5. Aplicar as migrations existentes

```bash
npx prisma migrate deploy
```

### 6. Popular o banco com os dados de demonstração

```bash
npx prisma db seed
```

O seed cria o workspace de demonstração, clientes, planos, assinaturas, histórico de transações e as três contas públicas de demonstração listadas anteriormente.

> **Importante:** o seed apaga e recria os dados de demonstração. Não execute esse comando em um banco que contenha dados que você precise preservar.

### 7. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador.

## Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run lint     # Executa o ESLint
npm run build    # Gera o Prisma Client e cria o build de produção
npm start        # Executa o servidor de produção após o build
```

Antes de publicar alterações, utilizo:

```bash
npm run lint
npm run build
```

## Destaques Técnicos

### Permissões aplicadas no servidor

As verificações de função são compartilhadas pelos handlers da API, para que operações protegidas não dependam apenas de botões ocultos ou desabilitados na interface.

### Isolamento por workspace

As consultas de negócio utilizam o `workspaceId` do usuário autenticado, mantendo os registros pertencentes a cada workspace devidamente isolados.

### Contas públicas de demonstração protegidas

As contas de demonstração Admin, Manager e User são usuários reais do banco de dados. As credenciais publicadas são protegidas para evitar que um visitante altere essas informações e torne a demo inutilizável para os próximos usuários.

### Dados de demonstração realistas

O seed do banco cria assinaturas históricas e registros recorrentes de transações, incluindo casos Paid, Pending, Failed e Refunded. Isso permite que analytics, alertas, filtros e tabelas operem sobre dados coerentes em vez de valores desconectados e fixos na interface.

### Estados reutilizáveis de UI

As páginas de dados compartilham padrões de busca, filtragem, ordenação, paginação, skeletons de carregamento, estados vazios e estados de erro. Os skeletons foram desenvolvidos para se aproximar do layout final em vez de utilizar placeholders genéricos sem relação com o conteúdo.

## Escopo do Projeto

Este é um projeto de portfólio para administração de um SaaS, e não um provedor real de pagamentos.

- As transações são registros da aplicação/demo; o projeto não processa pagamentos reais com cartão.
- Clientes e transações atualmente possuem páginas de gerenciamento somente para leitura.
- Planos e alterações de status de assinaturas podem ser gerenciados por Admins e Managers.
- O gerenciamento da equipe é restrito a usuários Admin.

O objetivo é demonstrar uma arquitetura full-stack de dashboard realista, autenticação e autorização, dados relacionais, comunicação com APIs, padrões de UI com estado e uma interface administrativa polida, sem fingir que o projeto implementa todos os recursos de uma plataforma real de cobrança.

## Melhorias Futuras

Possíveis próximos passos incluem:

- Adicionar testes automatizados unitários e de integração
- Adicionar fluxos de gerenciamento de clientes
- Adicionar filtros mais avançados por período/data para analytics e transações
- Adicionar histórico de atividades/auditoria para alterações administrativas

## Autor

**Matheus Faria**

Desenvolvedor front-end focado em React, TypeScript e Next.js.
