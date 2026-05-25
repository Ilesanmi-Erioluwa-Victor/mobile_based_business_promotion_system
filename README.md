# BizPromo

Design and Implementation of a Mobile-Based Business Promotion System for Small Scale Enterprises.

## Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Frontend: React.js, Vite, TailwindCSS
- Payments: Paystack Inline JS and Paystack REST API

## Setup

1. Install backend dependencies:
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run seed
   npm run dev
   ```

2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   cp .env.example .env
   npm run dev
   ```

The API runs on `http://localhost:5000/api` and the client runs on `http://localhost:5173`.

## Demo Accounts

- Owner: `emeka@bizpromo.com` / `password123`
- Customer: `amaka@bizpromo.com` / `password123`

## Tests

```bash
cd server
npm test
```
