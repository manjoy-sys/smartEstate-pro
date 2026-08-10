# SmartEstate Pro - Testing & Verification Guide

## 🔍 Issues Found & Fixes

### **CRITICAL ISSUES:**

1. **API Port Mismatch**
   - `client/src/App.jsx` uses: `http://localhost:4000`
   - `server/src/index.js` defaults to: `PORT 4000` ✅ (This is correct)
   - But server can also use `PORT 5000` from `.env`
   - **FIX:** Keep server on port 4000 or update client to match

2. **CORS URL Mismatch**
   - Server expects: `FRONTEND_URL=http://localhost:5173` (Vite default)
   - Client actually runs on: `http://localhost:3000` 
   - **FIX:** Update `server/.env` to `FRONTEND_URL=http://localhost:3000`

3. **Missing Prisma Schema**
   - Server needs `server/prisma/schema.prisma` to work
   - **FIX:** Create schema or initialize Prisma

4. **Missing Environment Files**
   - `.env` files are not created yet
   - **FIX:** Create them from `.env.example`

---

## ✅ Local Testing Checklist

### Step 1: Setup Backend
```bash
cd server

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="sqlite://./dev.db"
JWT_SECRET="dev_secret_change_this_in_production"
PORT=4000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
EOF

# Install dependencies
npm install

# Initialize Prisma (if needed)
npx prisma generate
npx prisma migrate dev --name init

# Start server
npm run dev
```

**Expected output:**
```
Server listening on http://localhost:4000
```

### Step 2: Setup Frontend
```bash
cd ../client

# Create .env file
cat > .env << 'EOF'
VITE_API_URL="http://localhost:4000"
VITE_APP_NAME="SmartEstate Pro"
VITE_APP_VERSION="1.0.0"
EOF

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

---

## 🧪 Manual Testing Workflow

### Test 1: Frontend Loads ✓
1. Open browser to `http://localhost:5173/smartEstate-pro/`
2. Should see: "SmartEstate Pro (MVP)" title
3. Should see: Email & password input fields
4. Should see: Register, Login, "Who am I" buttons

**If blank page:** Check browser console (F12 → Console tab)

---

### Test 2: Register New User
1. Enter email: `test@example.com`
2. Enter password: `testpass123`
3. Click **Register** button
4. **Expected response in "Message" box:**
   ```json
   {
     "message": "account created, check email for verification (dev: email logged to console)"
   }
   ```

**If it fails:**
- Check server console for errors
- Verify backend is running on port 4000
- Check CORS settings in server logs

---

### Test 3: Login
1. Use same email & password from Test 2
2. Click **Login** button
3. **Expected response:**
   ```json
   {
     "accessToken": "eyJhbGc..."
   }
   ```

**If you get error:**
- "invalid credentials" = password is wrong
- "user not found" = email not registered
- CORS error = backend not running or wrong URL

---

### Test 4: Check Who Am I
1. After successful login (you should have an access token)
2. Click **Who am I** button
3. **Expected response:**
   ```json
   {
     "id": "...",
     "email": "test@example.com",
     "name": null,
     "verified": false
   }
   ```

**If you get error:**
- "no access token" = login failed
- "Unauthorized" = token expired or invalid

---

## 🔧 Debugging Commands

### Check Backend Status
```bash
# From server directory
curl http://localhost:4000/health 2>/dev/null || echo "❌ Backend not running"

# Or test auth endpoint
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' 2>/dev/null
```

### Check Frontend Build
```bash
cd client
npm run build

# Should create dist/ folder with index.html
ls -la dist/
```

### Check Vite Config
```bash
# Test that base path is correct
grep "base:" client/vite.config.js
# Should output: base: '/smartEstate-pro/',
```

---

## 🚀 GitHub Pages Deployment Test

### Local Build Test
```bash
cd client
npm run build

# Test build output
npm run preview

# Should open on http://localhost:4173/smartEstate-pro/
```

### Pre-Deployment Checklist
- [ ] Backend server working locally
- [ ] Frontend loads without errors
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] "Who am I" returns user data
- [ ] `client/vite.config.js` has `base: '/smartEstate-pro/'`
- [ ] `.env` files created and configured
- [ ] Git workflow added at `.github/workflows/deploy.yml`

### Deploy to GitHub Pages
```bash
# Commit all changes
git add .
git commit -m "feat: setup web app with testing"
git push origin main

# Check GitHub Actions
# Go to: https://github.com/manjoy-sys/smartEstate-pro/actions
```

### After Deployment
- Visit: `https://manjoy-sys.github.io/smartEstate-pro/`
- You should see the login form
- ⚠️ **Note:** Backend API calls won't work on GitHub Pages (no backend deployed)
- To fix: Deploy backend to Vercel, Heroku, or AWS

---

## 🔗 Production Deployment (Backend)

### Option 1: Vercel (Easiest)
```bash
npm i -g vercel
cd server
vercel
# Follow prompts to deploy
```

### Option 2: Heroku
```bash
heroku create smartestate-api
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="your-secret"
git push heroku main
```

### Option 3: Railway.app (Simple)
1. Push to GitHub
2. Connect repo on railway.app
3. Add environment variables
4. Deploy

---

## 📊 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot GET /smartEstate-pro/" | Frontend build missing | Run `npm run build` in client |
| CORS error | Backend CORS not configured | Update `FRONTEND_URL` in server/.env |
| "Cannot POST /auth/register" | Backend not running | Run `npm run dev` in server |
| "API is undefined" | Wrong API URL | Check `VITE_API_URL` in client/.env |
| "User not found" | Didn't register first | Click Register button first |
| Blank white page | Console errors | Press F12, check Console tab |

---

## ✨ Success Criteria

Your web app is working when:
1. ✅ Frontend loads without console errors
2. ✅ You can register a new user
3. ✅ You can login with those credentials
4. ✅ "Who am I" returns your user info
5. ✅ All buttons are responsive
6. ✅ No CORS errors in console

---

**Need help?** Run these commands and share the output:
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

# Terminal 3 - Test API
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' | jq
```
