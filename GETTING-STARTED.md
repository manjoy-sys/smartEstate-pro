# SmartEstate Pro - Getting Started Guide

## 🎯 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))
- A terminal/command prompt

---

## ⚡ Step 1: Clone the Repository

```bash
git clone https://github.com/manjoy-sys/smartEstate-pro.git
cd smartEstate-pro
```

---

## 🔧 Step 2: Setup Backend

Open a **new terminal** and run:

```bash
cd server

# Create .env file
cp .env.example .env

# Edit .env with a text editor and set:
# DATABASE_URL="sqlite://./dev.db"
# JWT_SECRET="dev_secret_123"
# PORT=4000
# FRONTEND_URL="http://localhost:3000"

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (create database)
npx prisma migrate dev --name init

# Start server
npm run dev
```

**Expected output:**
```
Server listening on http://localhost:4000
```

✅ **Backend is now running!**

---

## 🎨 Step 3: Setup Frontend

Open a **different terminal** and run:

```bash
cd client

# Create .env file
cp .env.example .env

# Edit .env with a text editor and set:
# VITE_API_URL="http://localhost:4000"

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/smartEstate-pro/
```

✅ **Frontend is now running!**

---

## 🌐 Step 4: Open Your Browser

Open: **http://localhost:5173/smartEstate-pro/**

You should see:
- 🏠 SmartEstate Pro (MVP) title
- Email & password input fields
- Register, Login, and "Who am I?" buttons
- A response message box

---

## ✅ Step 5: Test the App

### Test 1: Register a User
1. Enter email: `test@example.com`
2. Enter password: `password123`
3. Click **Register**
4. You should see success message

### Test 2: Login
1. Use same email & password
2. Click **Login**
3. You should see access token

### Test 3: Check User Info
1. Click **Who am I?**
2. You should see your user details

---

## 📁 Project Files

After following the setup, your folder structure should look like:

```
smartEstate-pro/
├── server/
│   ├── .env                    # 👈 You created this
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── dev.db              # SQLite database (auto-created)
│   ├── src/
│   │   └── index.js            # Express server
│   ├── package.json
│   └── node_modules/           # Dependencies
│
├── client/
│   ├── .env                    # 👈 You created this
│   ├── .env.example
│   ├── src/
│   │   ├── App.jsx             # Main component
│   │   ├── main.jsx            # Entry point
│   │   └── styles.css          # Styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── node_modules/           # Dependencies
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages workflow
│
├── README.md                   # Project info
├── TESTING.md                  # Testing guide
├── DEPLOYMENT.md               # Deploy guide
└── GETTING-STARTED.md          # This file
```

---

## 🐛 Troubleshooting

### Frontend shows blank page
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Common issue: Backend not running on port 4000

### "Cannot connect to API" error
```bash
# Check backend is running:
curl http://localhost:4000/health

# If error, backend not running:
cd server
npm run dev
```

### Port already in use
```bash
# Backend on different port:
PORT=5000 npm run dev

# Then update client .env:
VITE_API_URL="http://localhost:5000"
```

### Database error
```bash
# Reset database:
cd server
rm prisma/dev.db
npx prisma migrate dev --name init
npm run dev
```

### "Module not found" error
```bash
# Reinstall dependencies:
npm install

# Or clean and reinstall:
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Two Terminal Setup

You need **2 terminal windows** open at the same time:

**Terminal 1 (Backend):**
```bash
cd smartEstate-pro/server
npm run dev
# Should show: Server listening on http://localhost:4000
```

**Terminal 2 (Frontend):**
```bash
cd smartEstate-pro/client
npm run dev
# Should show: Local: http://localhost:5173/smartEstate-pro/
```

---

## 🚀 Next Steps

1. ✅ **Verify it's working** → Follow Step 5 above
2. 📖 **Learn more** → Read [TESTING.md](./TESTING.md)
3. 🔄 **Deploy to GitHub Pages** → Read [DEPLOYMENT.md](./DEPLOYMENT.md)
4. 🌍 **Deploy backend** → See production options in [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📝 Environment Variables Explained

### Backend (.env in `server/`)
| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Database connection | `sqlite://./dev.db` |
| `JWT_SECRET` | Secret key for tokens | `dev_secret_123` |
| `PORT` | Server port | `4000` |
| `FRONTEND_URL` | Frontend address for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

### Frontend (.env in `client/`)
| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API address | `http://localhost:4000` |
| `VITE_APP_NAME` | App name | `SmartEstate Pro` |
| `VITE_APP_VERSION` | Version | `1.0.0` |

---

## 💡 Tips & Tricks

### Keep backend running while developing
```bash
# In server directory:
npm run dev
# The `nodemon` tool auto-restarts on file changes
```

### Hot reload frontend
```bash
# In client directory:
npm run dev
# Vite automatically reloads on file saves
```

### View database (SQLite)
```bash
# Install SQLite viewer (optional):
npm install -g sqlite3

# View database:
cd server
sqlite3 prisma/dev.db
.tables
.exit
```

### Check what's running on ports
```bash
# macOS/Linux:
lsof -i :4000  # Backend port
lsof -i :5173  # Frontend port

# Windows:
netstat -ano | findstr :4000
netstat -ano | findstr :5173
```

---

## ❓ FAQs

**Q: Can I use a different database?**
A: Yes! Change `DATABASE_URL` in `.env` to use PostgreSQL, MySQL, etc.

**Q: Do I need to deploy backend to use GitHub Pages?**
A: GitHub Pages hosts static sites only. Backend needs separate hosting (Vercel, Heroku, AWS).

**Q: How do I stop the servers?**
A: Press `Ctrl+C` in the terminal.

**Q: Can I run both backend and frontend in one terminal?**
A: Yes, use the root `package.json`: `npm run dev`

**Q: How do I change the API URL for production?**
A: Update `VITE_API_URL` in `client/.env` to your production API URL.

---

## 📞 Need Help?

1. Check [TESTING.md](./TESTING.md) for debugging
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
3. Look at GitHub Issues in the repo
4. Check server console for error messages
5. Check browser console (F12) for frontend errors

---

**Ready?** Start from Step 1 above! 🚀
