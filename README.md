# OOPS Admin Panel

Admin dashboard for OOPS Fashion — manage products, orders, customers, and reviews.

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- Framer Motion
- Flowbite React (tables, modals, cards)
- Chart.js (dashboard analytics)

## Features

- **Dashboard:** Revenue, orders, top products, sold-out alerts
- **Products:** CRUD, image upload (Cloudinary), stock management, size/status control
- **Orders:** List with filters, status advancement (placed → processing → shipped → delivered)
- **Customers:** Aggregated from orders, search, order history
- **Reviews:** View and delete inappropriate reviews
- **Settings:** Email trigger configuration, Gmail OAuth connection
- **Auth:** 2FA login (password + OTP)

## Project Structure

```
src/
├── common/          # Sidebar, ProtectedRoute, Layout
├── context/         # AdminAuthContext
├── pages/
│   ├── dashboard/   # Stats, charts, recent orders, top products
│   ├── products/    # ProductsPage, ProductEditorPage, ProductDetailPage
│   ├── orders/      # OrdersPage, OrderDetailPage
│   ├── customers/   # CustomersPage
│   ├── settings/    # Email settings
│   └── login/       # 2FA login flow
└── utils/           # api.js
```

## Setup

```bash
npm install
npm run dev
```

## Environment

In development, Vite proxies `/api` to `http://localhost:5001`. No environment variables needed for local dev.

## Admin Login

Requires admin role account. Login is 2-step:
1. Email + password → server sends OTP
2. Enter 6-digit OTP → access granted

## Build

```bash
npm run build
```

Output in `dist/`.
