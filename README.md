# SmartEstate Pro

This branch implements an MVP web app with a Node.js backend (email+password auth) and a minimal React frontend.

Quickstart (development)

1. Backend

- Copy .env.example to server/.env and fill values (DATABASE_URL, JWT_SECRET).
- From the repo root:
  cd server
  npm install
  # Generate Prisma client after you set DATABASE_URL and run migrations (see Prisma docs)
  npx prisma generate
  # Start server
  npm run dev

2. Frontend

  cd client
  npm install
  npm run dev

Notes
- By default the backend logs emails to console. Provide SMTP credentials in server/.env to enable real email sending.
- The default token strategy is short-lived JWT access tokens (15m) and a HttpOnly refresh token cookie (7d).
