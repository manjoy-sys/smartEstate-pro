# SmartEstate Pro - Deployment Guide

## 📋 Overview
This guide covers deploying SmartEstate Pro to GitHub Pages (frontend) and running the backend locally or on a server.

---

## 🚀 Quick Deploy to GitHub Pages

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Step 1: Clone & Setup

```bash
git clone https://github.com/manjoy-sys/smartEstate-pro.git
cd smartEstate-pro
```

### Step 2: Configure Environment Variables

**For Backend:**
```bash
cd server
cp .env.example .env
# Edit .env with your database and JWT secrets
```

**For Frontend:**
```bash
cd ../client
cp .env.example .env
```

### Step 3: Install Dependencies

```bash
# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install
```

### Step 4: Build Frontend

```bash
cd client
npm run build
```

This creates a `dist/` folder ready for GitHub Pages.

### Step 5: Trigger Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys when you:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

✅ **Your site will be live at:** `https://manjoy-sys.github.io/smartEstate-pro/`

---

## 🔧 Local Development

### Terminal 1: Run Backend
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### Terminal 2: Run Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

Both will auto-reload on file changes.

---

## 📦 Production Deployment

### Option 1: Vercel (Recommended for Full Stack)
```bash
npm i -g vercel
vercel
```

### Option 2: Heroku (Backend)
```bash
cd server
heroku create smartestate-api
git push heroku main
```

### Option 3: AWS/DigitalOcean (Full Stack)
- Deploy backend to your VPS
- Deploy frontend to S3 + CloudFront

---

## 🔐 GitHub Pages Settings

1. Go to: https://github.com/manjoy-sys/smartEstate-pro/settings/pages
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` (auto-created by deployment workflow)
4. **Folder:** `/ (root)`
5. Save

---

## ✅ Verify Deployment

```bash
# Check GitHub Actions
Go to: Actions tab → Deploy to GitHub Pages

# Test your site
Visit: https://manjoy-sys.github.io/smartEstate-pro/
```

---

## 🐛 Troubleshooting

### Build fails?
```bash
cd client
npm run build -- --debug
```

### Blank page on deployment?
- Check that `base: '/smartEstate-pro/'` is in `client/vite.config.js`
- Clear browser cache
- Check console for errors

### API not connecting?
- Ensure backend is running on `localhost:5000`
- Update `VITE_API_URL` in `client/.env`

---

## 📝 Next Steps

1. ✅ Deploy frontend to GitHub Pages
2. 🔄 Deploy backend to a server (Vercel, Heroku, AWS)
3. 🔗 Update API URL to your production backend
4. 🔐 Enable HTTPS (GitHub Pages does this automatically)
5. 📊 Set up monitoring & logging

---

**Questions?** Check the main [README.md](./README.md)
