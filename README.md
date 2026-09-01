# SaaS Admin Dashboard

[English](./README.md) | [Português](./README.pt-BR.md)

A full-stack SaaS management dashboard built with Next.js, TypeScript, Prisma, PostgreSQL, and Auth.js.

The application simulates an internal workspace used by a SaaS team to monitor revenue, customers, plans, subscriptions, transactions, and team members. It includes authentication, role-based permissions, analytics, customer and subscription management workflows, reusable data tables, loading/error states, notifications, dark mode, responsive layouts, and realistic seeded demo data.

![Dashboard overview](./docs/screenshots/dashboard-light.png)

## Live Demo

**Live application:** [Open the live demo](https://saas-admin-dashboard-theta.vercel.app)

The project includes protected demo accounts so reviewers can test the three permission levels without creating their own data.

| Role    | Email               | Password           |
| ------- | ------------------- | ------------------ |
| Admin   | `admin@email.com`   | `AdminDemo2026!`   |
| Manager | `manager@email.com` | `ManagerDemo2026!` |
| User    | `user@email.com`    | `UserDemo2026!`    |

> The published demo accounts are intentionally protected from changes that would break the public credentials.

## Features

- Analytics dashboard with MRR, ARR, active subscriptions, customers, total revenue, and recent transactions
- Revenue history, subscription growth, subscription status, and subscriptions-by-plan charts
- Team, customer, plan, subscription, and transaction views
- Customer management for Admin/Manager roles, including create, edit, and guarded delete workflows
- Subscription creation with workspace validation and protection against duplicate current subscriptions
- Search, status filtering, sorting, and pagination for data-heavy pages
- Role-based authorization for **Admin**, **Manager**, and **User** accounts
- Auth.js credentials authentication with hashed passwords and JWT-based sessions
- Workspace-scoped data access
- Reusable API/service/hook data flow
- Form and API validation with Zod
- Loading skeletons, empty states, error states, confirmation dialogs, and toast feedback
- Data-derived notification alerts with unseen counts and persistent active-alert indicators
- Light and dark themes
- Responsive layouts for desktop, tablet, and mobile, including a mobile navigation drawer, compact header, scrollable tables, responsive pagination, and viewport-safe modals
- PostgreSQL database with realistic seeded SaaS data

## Role-Based Permissions

The three roles share access to the business data, while management actions are restricted by responsibility.

| Capability                                                   | Admin | Manager | User |
| ------------------------------------------------------------ | :---: | :-----: | :--: |
| View dashboard analytics                                     |   ✓   |    ✓    |  ✓   |
| View team, customers, plans, subscriptions, and transactions |   ✓   |    ✓    |  ✓   |
| Create/edit team members                                     |   ✓   |    —    |  —   |
| Create/edit/delete customers                                 |   ✓   |    ✓    |  —   |
| Create/edit plans                                            |   ✓   |    ✓    |  —   |
| Create subscriptions                                         |   ✓   |    ✓    |  —   |
| Update subscription status                                   |   ✓   |    ✓    |  —   |
| Update personal settings                                     |   ✓   |    ✓    |  ✓   |
| Update workspace name                                        |   ✓   |    —    |  —   |

Authorization is enforced on the server/API layer, not only by hiding controls in the interface.

Customer deletion is intentionally guarded when subscription history exists so billing-related historical data is not accidentally destroyed.

## Screenshots

### Subscription Management

![Subscription management](./docs/screenshots/subscriptions.png)

### Dark Mode

![Dashboard dark mode](./docs/screenshots/dashboard-dark.png)

### Authentication and Demo Roles

![Login and demo accounts](./docs/screenshots/login.png)

## Tech Stack

| Area             | Technology                                           |
| ---------------- | ---------------------------------------------------- |
| Framework        | Next.js (App Router)                                 |
| UI               | React + TypeScript                                   |
| Styling          | Tailwind CSS + shared global design tokens/styles    |
| Database         | PostgreSQL                                           |
| ORM              | Prisma                                               |
| Authentication   | Auth.js / NextAuth credentials provider              |
| Validation       | Zod                                                  |
| Password hashing | bcryptjs                                             |
| Charts           | Recharts with reusable Tremor-based chart components |
| Icons            | Lucide React + Remix Icon React                      |
| Deployment       | Vercel                                               |
| Code quality     | ESLint + Prettier                                    |

## Application Domain

The dashboard separates the people who **use the administration system** from the customers who **buy the SaaS product**.

```text
Workspace
├── Team Members (Users)
├── Customers
│   └── Subscriptions
│       ├── Plan
│       └── Transactions
├── Plans
├── Subscriptions
└── Transactions
```

- **Team Members** are internal users of the dashboard and have an Admin, Manager, or User role.
- **Customers** represent SaaS customers/contacts and can be associated with a company.
- **Plans** define the available monthly subscription tiers.
- **Subscriptions** connect customers to plans and track their status.
- **Transactions** represent individual payment events such as Paid, Pending, Failed, or Refunded payments.

A customer can exist before having a subscription. A customer can also have subscription history over time, while the application prevents multiple simultaneous current Active/Trialing subscriptions for the same customer.

## Architecture

The client-side data flow is intentionally separated into small responsibilities:

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

For example, a page uses a custom hook to manage loading/error/data state. The hook calls a service, the service sends the HTTP request to a Next.js Route Handler, and the API route performs authorization and accesses PostgreSQL through Prisma.

Authentication follows a separate server-side flow using Auth.js. Protected application pages read the authenticated session, while API routes use reusable authorization helpers such as authenticated-user, Admin-only, and Manager-or-Admin checks.

## Dashboard Metrics

The Dashboard derives its metrics from the database rather than using hard-coded card values.

- **MRR** — sum of the monthly prices of currently active subscriptions
- **ARR** — annualized recurring revenue derived from current MRR (`MRR × 12`)
- **Active Subscriptions** — subscriptions currently marked Active
- **Customers** — total customers in the current workspace
- **Total Revenue** — sum of transactions with the Paid status
- **Revenue Over Time** — successful payment revenue grouped by month
- **Subscription Growth** — size of the subscription base over time

## Responsive Design

The interface uses Tailwind responsive breakpoints to adapt the same dashboard to different screen sizes without maintaining a separate mobile application.

- **Desktop** — persistent collapsible sidebar, full header identity, multi-column layouts, and complete pagination controls
- **Tablet** — adjusted spacing and layouts with the sidebar switching to mobile navigation behavior when appropriate
- **Mobile** — slide-out navigation drawer, compact header, reduced page padding, wrapped/stacked controls, simplified pagination, horizontally scrollable data tables, and viewport-safe scrolling modals

The data tables keep their useful desktop column structure on small screens by allowing horizontal scrolling instead of compressing complex business data into unreadable columns.

## Notifications

Notification alerts are derived from current business data, including relevant payment and subscription conditions.

The bell separates **new alerts** from **unresolved alerts**:

- A numeric badge represents active alerts the current user has not seen yet.
- Opening the notification panel marks the currently displayed alerts as seen.
- Seen alerts remain listed while their underlying condition is still active.
- When all current alerts have been seen but unresolved alerts remain, the bell keeps a subtle active-alert indicator.
- A newly created alert receives a new identifier and makes the unseen badge appear again.

For the portfolio demo, seen notification IDs are stored per account in the browser while the active alerts themselves continue to come from the database-backed API.

## Project Structure

Only the main application areas are shown here.

```text
saas-admin-dashboard/
├── docs/
│   └── screenshots/       # README screenshots
│
├── prisma/
│   ├── migrations/        # Database schema history
│   ├── schema.prisma      # Database models and relations
│   └── seed.ts            # Realistic demo data
│
├── public/                # Static assets
│
├── src/
│   ├── app/               # Pages, layouts, Server Actions and API routes
│   ├── components/        # Reusable UI and feature components
│   ├── constants/         # Shared fixed values and validation rules
│   ├── contexts/          # Shared React context
│   ├── generated/         # Generated Prisma client (not committed)
│   ├── hooks/             # Reusable client-side React logic
│   ├── lib/               # Shared infrastructure/helpers
│   ├── services/          # Client-side API communication
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Focused utility functions
│   ├── auth.ts            # Auth.js configuration
│   └── proxy.ts           # Authentication-aware route checkpoint
│
├── .env                   # Local environment variables (not committed)
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Before running the project locally, you need:

- Node.js and npm
- A PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/Matheus-mff/saas-admin-dashboard.git
cd saas-admin-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="YOUR_AUTH_SECRET"
```

Do not commit your real `.env` file or production secrets.

### 4. Generate the Prisma client

```bash
npx prisma generate
```

### 5. Apply the existing database migrations

```bash
npx prisma migrate deploy
```

### 6. Seed the demo database

```bash
npx prisma db seed
```

The seed creates the demo workspace, customers, plans, subscriptions, transaction history, and the three public demo accounts listed above.

> **Important:** the seed resets the demo data before recreating it. Do not run it against a database containing data you need to preserve.

### 7. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Generate Prisma Client and create a production build
npm start        # Run the production server after building
```

Before publishing changes, I use:

```bash
npm run lint
npm run build
```

## Technical Highlights

### Server-enforced permissions

Role checks are shared by API handlers so protected operations are not secured only through disabled or hidden buttons in the UI.

### Workspace isolation

Business queries use the authenticated user's `workspaceId`, keeping workspace-owned records scoped to the active workspace.

### Customer and subscription lifecycle

Admin/Manager users can create and edit customers, create subscriptions, and manage subscription status. Customer deletion is blocked when subscription history exists, preserving historical billing relationships instead of cascading away important records.

Subscription creation also validates that the selected customer and plan belong to the authenticated workspace and prevents a customer from receiving another simultaneous Active/Trialing subscription.

### Notification lifecycle

Alerts are derived from current payment/subscription conditions instead of being disposable hard-coded messages. The UI distinguishes unseen alerts from seen-but-still-active alerts, while newly generated business alerts become unseen again.

### Responsive administration UI

The dashboard uses responsive Tailwind layouts across the application shell and shared UI components. Mobile navigation, compact headers, scrollable tables, responsive pagination, and viewport-safe modals allow the same operational workflows to remain usable on smaller screens.

### Protected public demo accounts

The Admin, Manager, and User demo accounts are real database users. Their published profile credentials are protected so a portfolio reviewer cannot accidentally make the demo unusable for the next visitor.

### Realistic seed data

The database seed creates historical subscriptions and recurring transaction records, including Paid, Pending, Failed, and Refunded cases. This allows the dashboard analytics, alerts, filters, and tables to operate on coherent data instead of disconnected hard-coded UI values.

### Reusable UI states

Data pages share patterns for search, filtering, sorting, pagination, loading skeletons, empty states, and errors. Skeletons are designed to resemble the final layout rather than showing unrelated generic placeholders.

## Project Scope

This is a portfolio SaaS administration project, not a real billing provider.

- Transactions are application/demo records; the project does not process real card payments.
- Customers can be created, edited, and deleted by Admin/Manager users when deletion does not conflict with subscription history.
- Plans and subscriptions are management workflows for Admin/Manager roles.
- Team management is restricted to Admin users.
- Notification seen state is intentionally lightweight and browser-based for the demo; a production system could persist per-user read state on the server for cross-device synchronization.

The goal is to demonstrate a realistic full-stack dashboard architecture, authentication/authorization, relational data, API communication, stateful UI patterns, responsive design, and a polished administration interface without pretending to implement every feature of a production billing platform.

## Future Improvements

Possible next steps include:

- Adding automated unit/integration tests
- Adding more advanced date/range filters for analytics and transactions
- Adding an audit/activity history for administrative changes
- Persisting notification read/unread state server-side for cross-device synchronization

## Author

**Matheus Faria**

Front-end developer focused on React, TypeScript, and Next.js.
