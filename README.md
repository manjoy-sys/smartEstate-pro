# SmartEstate Pro

A modern full-stack real estate platform MVP with Node.js backend and React frontend.

## ✨ Features

- **User Authentication** - Email/password registration & login with JWT
- **Secure Sessions** - HttpOnly refresh token cookies (7 days)
- **Email Verification** - Account verification flow
- **React Frontend** - Modern UI with Vite
- **Express Backend** - RESTful API with Prisma ORM

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env and set DATABASE_URL and JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
# Server runs on http://localhost:4000
```

### Frontend Setup
```bash
cd client
cp .env.example .env
npm install
npm run dev
# Frontend runs on http://localhost:5173/smartEstate-pro/
```

---

## 📋 Project Structure

```
smartEstate-pro/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── styles.css     # Base styles
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   └── index.js       # Server & API routes
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
├── package.json           # Root scripts
├── README.md             # This file
├── DEPLOYMENT.md         # Deployment guide
└── TESTING.md           # Testing guide
```

---

## 🔑 API Routes

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/me` - Get current user (requires token)
- `GET /users/:id` - Get user by ID

---

## 🔧 Configuration

### Server Environment Variables
```env
DATABASE_URL="postgresql://user:pass@localhost/dbname"
JWT_SECRET="your-super-secret-key"
PORT=4000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
SMTP_HOST="smtp.gmail.com"  # Optional
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Frontend Environment Variables
```env
VITE_API_URL="http://localhost:4000"
VITE_APP_NAME="SmartEstate Pro"
VITE_APP_VERSION="1.0.0"
```

---

## 📦 Build & Deploy

### Build for Production
```bash
# Build frontend
cd client
npm run build

# Build backend (optional)
cd ../server
npm run build
```

### Deploy Frontend to GitHub Pages
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
# Automatic deployment via GitHub Actions
# Live at: https://manjoy-sys.github.io/smartEstate-pro/
```

### Deploy Backend
See [DEPLOYMENT.md](./DEPLOYMENT.md) for options:
- Vercel
- Heroku
- AWS
- DigitalOcean

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for:
- Local testing checklist
- Manual testing workflow
- Debugging commands
- Common errors & solutions

---

## 📝 Technology Stack

**Frontend:**
- React 18.2
- Vite 5
- Axios for HTTP requests
- CSS for styling

**Backend:**
- Express 4.18
- Prisma ORM 5
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for emails
- PostgreSQL/SQLite

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt (salt rounds: 12)
- Access tokens expire in 15 minutes
- Refresh tokens stored in HttpOnly cookies (7 days)
- CORS enabled only for FRONTEND_URL
- Email verification required for new accounts

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Try different port
PORT=5000 npm run dev
```

### Database connection error
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Try creating local SQLite database
DATABASE_URL="sqlite://./dev.db" npm run dev
```

### Frontend blank page
1. Open developer tools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Verify `VITE_API_URL` in `.env`

### CORS errors
- Ensure `FRONTEND_URL` in server/.env matches your frontend URL
- Frontend must be on `http://localhost:3000` or `http://localhost:5173`

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Documentation](https://jwt.io)

---

## 📄 License

MIT

---

**Questions?** Check:
- [TESTING.md](./TESTING.md) - Testing guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- GitHub Issues - Report bugs

**Last Updated:** 2026-08-10
