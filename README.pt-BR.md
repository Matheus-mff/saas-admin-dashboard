# SaaS Admin Dashboard

[English](./README.md) | [Português](./README.pt-BR.md)

Um dashboard full-stack de gerenciamento SaaS construído com Next.js, TypeScript, Prisma, PostgreSQL e Auth.js.

A aplicação simula um workspace interno usado por uma equipe SaaS para monitorar receita, clientes, planos, assinaturas, transações e membros da equipe. Ela inclui autenticação, permissões baseadas em função, analytics, fluxos de gerenciamento de clientes e assinaturas, tabelas de dados reutilizáveis, estados de carregamento/erro, notificações, modo escuro, layouts responsivos e dados de demonstração realistas.

![Visão geral do dashboard](./docs/screenshots/dashboard-light.png)

## Demo ao Vivo

**Aplicação ao vivo:** [Abrir a demo](https://saas-admin-dashboard-theta.vercel.app)

O projeto inclui contas de demonstração protegidas para que avaliadores possam testar os três níveis de permissão sem precisar criar seus próprios dados.

| Função  | Email               | Senha              |
| ------- | ------------------- | ------------------ |
| Admin   | `admin@email.com`   | `AdminDemo2026!`   |
| Manager | `manager@email.com` | `ManagerDemo2026!` |
| User    | `user@email.com`    | `UserDemo2026!`    |

> As contas públicas de demonstração são protegidas intencionalmente contra alterações que poderiam quebrar as credenciais públicas.

## Funcionalidades

- Dashboard analítico com MRR, ARR, assinaturas ativas, clientes, receita total e transações recentes
- Histórico de receita, crescimento de assinaturas, status de assinaturas e gráficos de assinaturas por plano
- Visualizações de equipe, clientes, planos, assinaturas e transações
- Gerenciamento de clientes para Admin/Manager, incluindo criação, edição e exclusão protegida
- Criação de assinaturas com validação de workspace e proteção contra assinaturas atuais duplicadas
- Busca, filtros por status, ordenação e paginação em páginas com muitos dados
- Autorização baseada em função para contas **Admin**, **Manager** e **User**
- Autenticação por credenciais com Auth.js, senhas com hash e sessões baseadas em JWT
- Acesso a dados isolado por workspace
- Fluxo reutilizável API/service/hook
- Validação de formulários e APIs com Zod
- Skeletons de carregamento, estados vazios, estados de erro, diálogos de confirmação e feedback por toast
- Alertas derivados dos dados com contagem de não vistos e indicador persistente de alertas ativos
- Temas claro e escuro
- Layouts responsivos para desktop, tablet e mobile, incluindo navegação lateral em drawer, header compacto, tabelas com rolagem horizontal, paginação responsiva e modais seguros para diferentes alturas de tela
- Banco PostgreSQL com dados SaaS realistas para demonstração

## Permissões por Função

As três funções compartilham acesso aos dados do negócio, enquanto ações de gerenciamento são restritas de acordo com a responsabilidade.

| Capacidade                                                    | Admin | Manager | User |
| ------------------------------------------------------------- | :---: | :-----: | :--: |
| Visualizar analytics do dashboard                             |   ✓   |    ✓    |  ✓   |
| Visualizar equipe, clientes, planos, assinaturas e transações |   ✓   |    ✓    |  ✓   |
| Criar/editar membros da equipe                                |   ✓   |    —    |  —   |
| Criar/editar/excluir clientes                                 |   ✓   |    ✓    |  —   |
| Criar/editar planos                                           |   ✓   |    ✓    |  —   |
| Criar assinaturas                                             |   ✓   |    ✓    |  —   |
| Atualizar status de assinaturas                               |   ✓   |    ✓    |  —   |
| Atualizar configurações pessoais                              |   ✓   |    ✓    |  ✓   |
| Atualizar nome do workspace                                   |   ✓   |    —    |  —   |

A autorização é aplicada no servidor/API, e não apenas por meio de controles escondidos ou desabilitados na interface.

A exclusão de clientes é protegida quando existe histórico de assinaturas, evitando que dados históricos relacionados a cobrança sejam apagados acidentalmente.

## Screenshots

### Gerenciamento de Assinaturas

![Gerenciamento de assinaturas](./docs/screenshots/subscriptions.png)

### Modo Escuro

![Dashboard em modo escuro](./docs/screenshots/dashboard-dark.png)

### Autenticação e Funções de Demonstração

![Login e contas de demonstração](./docs/screenshots/login.png)

## Stack Tecnológica

| Área                | Tecnologia                                                  |
| ------------------- | ----------------------------------------------------------- |
| Framework           | Next.js (App Router)                                        |
| UI                  | React + TypeScript                                          |
| Estilização         | Tailwind CSS + design tokens/estilos globais compartilhados |
| Banco de dados      | PostgreSQL                                                  |
| ORM                 | Prisma                                                      |
| Autenticação        | Auth.js / provider de credenciais do NextAuth               |
| Validação           | Zod                                                         |
| Hash de senhas      | bcryptjs                                                    |
| Gráficos            | Recharts com componentes reutilizáveis baseados em Tremor   |
| Ícones              | Lucide React + Remix Icon React                             |
| Deploy              | Vercel                                                      |
| Qualidade de código | ESLint + Prettier                                           |

## Domínio da Aplicação

O dashboard separa as pessoas que **usam o sistema administrativo** dos clientes que **compram o produto SaaS**.

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

- **Membros da Equipe** são usuários internos do dashboard e possuem função Admin, Manager ou User.
- **Clientes** representam clientes/contatos do SaaS e podem estar associados a uma empresa.
- **Planos** definem os níveis de assinatura mensal disponíveis.
- **Assinaturas** conectam clientes a planos e acompanham seu status.
- **Transações** representam eventos individuais de pagamento, como Paid, Pending, Failed ou Refunded.

Um cliente pode existir antes de ter uma assinatura. Ele também pode ter histórico de assinaturas ao longo do tempo, enquanto a aplicação impede múltiplas assinaturas atuais simultâneas com status Active/Trialing para o mesmo cliente.

## Arquitetura

O fluxo de dados do lado do cliente é separado intencionalmente em responsabilidades pequenas:

```text
Page / UI
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

Por exemplo, uma página usa um custom hook para gerenciar estados de carregamento/erro/dados. O hook chama um service, o service envia a requisição HTTP para um Route Handler do Next.js, e a rota da API executa a autorização e acessa o PostgreSQL por meio do Prisma.

A autenticação segue um fluxo separado no servidor usando Auth.js. As páginas protegidas da aplicação leem a sessão autenticada, enquanto as rotas de API usam helpers reutilizáveis de autorização, como usuário autenticado, somente Admin e Manager-ou-Admin.

## Métricas do Dashboard

O Dashboard deriva suas métricas do banco de dados em vez de usar valores hard-coded nos cards.

- **MRR** — soma dos preços mensais das assinaturas atualmente ativas
- **ARR** — receita recorrente anualizada derivada do MRR atual (`MRR × 12`)
- **Assinaturas Ativas** — assinaturas atualmente marcadas como Active
- **Clientes** — total de clientes no workspace atual
- **Receita Total** — soma das transações com status Paid
- **Receita ao Longo do Tempo** — receita de pagamentos bem-sucedidos agrupada por mês
- **Crescimento de Assinaturas** — tamanho da base de assinaturas ao longo do tempo

## Design Responsivo

A interface usa breakpoints responsivos do Tailwind para adaptar o mesmo dashboard a diferentes tamanhos de tela sem manter uma aplicação mobile separada.

- **Desktop** — sidebar persistente e colapsável, header completo com identidade do usuário, layouts com múltiplas colunas e controles completos de paginação
- **Tablet** — espaçamentos e layouts ajustados, com a sidebar mudando para comportamento de navegação mobile quando apropriado
- **Mobile** — drawer lateral, header compacto, padding reduzido, controles empilhados/quebrados em linha, paginação simplificada, tabelas com rolagem horizontal e modais com rolagem segura dentro da viewport

As tabelas mantêm sua estrutura útil de colunas do desktop em telas pequenas permitindo rolagem horizontal, em vez de comprimir dados de negócio complexos em colunas ilegíveis.

## Notificações

Os alertas são derivados dos dados atuais do negócio, incluindo condições relevantes de pagamento e assinatura.

O sino separa **novos alertas** de **alertas ainda não resolvidos**:

- Um badge numérico representa alertas ativos que o usuário atual ainda não viu.
- Abrir o painel de notificações marca os alertas exibidos naquele momento como vistos.
- Alertas vistos continuam listados enquanto a condição que os originou ainda estiver ativa.
- Quando todos os alertas atuais já foram vistos, mas ainda existem problemas não resolvidos, o sino mantém um indicador visual discreto.
- Um novo alerta recebe um novo identificador e faz o badge de não vistos aparecer novamente.

Para a demo do portfólio, os IDs de notificações vistas são armazenados por conta no navegador, enquanto os alertas ativos continuam vindo da API ligada ao banco de dados.

## Estrutura do Projeto

Apenas as principais áreas da aplicação são mostradas abaixo.

```text
saas-admin-dashboard/
├── docs/
│   └── screenshots/       # Screenshots do README
│
├── prisma/
│   ├── migrations/        # Histórico do schema do banco
│   ├── schema.prisma      # Models e relações do banco
│   └── seed.ts            # Dados realistas de demonstração
│
├── public/                # Assets estáticos
│
├── src/
│   ├── app/               # Páginas, layouts, Server Actions e rotas de API
│   ├── components/        # Componentes reutilizáveis de UI e features
│   ├── constants/         # Valores fixos e regras de validação compartilhadas
│   ├── contexts/          # Contexto React compartilhado
│   ├── generated/         # Prisma Client gerado (não versionado)
│   ├── hooks/             # Lógica React reutilizável no cliente
│   ├── lib/               # Infraestrutura/helpers compartilhados
│   ├── services/          # Comunicação client-side com APIs
│   ├── types/             # Tipos TypeScript compartilhados
│   ├── utils/             # Funções utilitárias focadas
│   ├── auth.ts            # Configuração do Auth.js
│   └── proxy.ts           # Ponto de controle de rotas com autenticação
│
├── .env                   # Variáveis de ambiente locais (não versionadas)
├── package.json
└── README.md
```

## Como Executar Localmente

### Pré-requisitos

Antes de executar o projeto localmente, você precisa de:

- Node.js e npm
- Um banco PostgreSQL

### 1. Clone o repositório

```bash
git clone https://github.com/Matheus-mff/saas-admin-dashboard.git
cd saas-admin-dashboard
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="YOUR_AUTH_SECRET"
```

Não faça commit do seu arquivo `.env` real nem de segredos de produção.

### 4. Gere o Prisma Client

```bash
npx prisma generate
```

### 5. Aplique as migrations existentes

```bash
npx prisma migrate deploy
```

### 6. Popule o banco com os dados de demonstração

```bash
npx prisma db seed
```

O seed cria o workspace de demonstração, clientes, planos, assinaturas, histórico de transações e as três contas públicas listadas acima.

> **Importante:** o seed reseta os dados de demonstração antes de recriá-los. Não o execute em um banco que contenha dados que você precisa preservar.

### 7. Inicie o servidor de desenvolvimento

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

Antes de publicar alterações, eu uso:

```bash
npm run lint
npm run build
```

## Destaques Técnicos

### Permissões aplicadas no servidor

As verificações de função são compartilhadas pelos handlers de API, portanto as operações protegidas não dependem apenas de botões escondidos ou desabilitados na interface.

### Isolamento por workspace

As queries de negócio usam o `workspaceId` do usuário autenticado, mantendo os registros pertencentes ao workspace limitados ao workspace ativo.

### Ciclo de vida de clientes e assinaturas

Usuários Admin/Manager podem criar e editar clientes, criar assinaturas e gerenciar o status das assinaturas. A exclusão de clientes é bloqueada quando existe histórico de assinaturas, preservando relações históricas de cobrança em vez de apagar registros importantes em cascata.

A criação de assinaturas também valida se o cliente e o plano selecionados pertencem ao workspace autenticado e impede que um cliente receba outra assinatura simultânea com status Active/Trialing.

### Ciclo de vida das notificações

Os alertas são derivados das condições atuais de pagamento/assinatura em vez de serem mensagens descartáveis hard-coded. A interface diferencia alertas não vistos de alertas vistos mas ainda ativos, enquanto novos eventos de negócio voltam a aparecer como não vistos.

### Interface administrativa responsiva

O dashboard usa layouts responsivos do Tailwind no shell da aplicação e em componentes compartilhados. Navegação mobile, headers compactos, tabelas com rolagem, paginação responsiva e modais adaptados à viewport mantêm os mesmos fluxos operacionais utilizáveis em telas menores.

### Contas públicas de demonstração protegidas

As contas Admin, Manager e User são usuários reais do banco de dados. Suas credenciais públicas de perfil são protegidas para que um avaliador do portfólio não torne a demo inutilizável para o próximo visitante.

### Dados de seed realistas

O seed cria assinaturas históricas e registros recorrentes de transações, incluindo casos Paid, Pending, Failed e Refunded. Isso permite que analytics, alertas, filtros e tabelas funcionem sobre dados coerentes, e não sobre valores de UI desconectados e hard-coded.

### Estados de UI reutilizáveis

As páginas de dados compartilham padrões de busca, filtragem, ordenação, paginação, skeletons, estados vazios e erros. Os skeletons são desenhados para se parecer com o layout final em vez de mostrar placeholders genéricos sem relação com a página.

## Escopo do Projeto

Este é um projeto de portfólio de administração SaaS, não um provedor real de cobrança.

- As transações são registros da aplicação/demo; o projeto não processa pagamentos reais com cartão.
- Clientes podem ser criados, editados e excluídos por usuários Admin/Manager quando a exclusão não entra em conflito com histórico de assinaturas.
- Planos e assinaturas são fluxos de gerenciamento para funções Admin/Manager.
- O gerenciamento da equipe é restrito a usuários Admin.
- O estado de notificações vistas é intencionalmente leve e armazenado no navegador para a demo; um sistema de produção poderia persistir o estado de leitura por usuário no servidor para sincronização entre dispositivos.

O objetivo é demonstrar uma arquitetura full-stack realista para dashboard, autenticação/autorização, dados relacionais, comunicação com APIs, padrões de UI com estado, design responsivo e uma interface administrativa polida sem fingir implementar todos os recursos de uma plataforma de cobrança em produção.

## Melhorias Futuras

Possíveis próximos passos incluem:

- Adicionar testes automatizados unitários/de integração
- Adicionar filtros mais avançados por data/período para analytics e transações
- Adicionar histórico de auditoria/atividade para alterações administrativas
- Persistir o estado de notificações lidas/não lidas no servidor para sincronização entre dispositivos

## Autor

**Matheus Faria**

Desenvolvedor front-end com foco em React, TypeScript e Next.js.
