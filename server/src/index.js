const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

function signAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}

async function sendEmail(to, subject, text) {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
  } else {
    console.log('--- email (dev) ---');
    console.log({ to, subject, text });
    console.log('-------------------');
  }
}

app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'email already registered' });

  const password_hash = await bcrypt.hash(password, 12);
  const verification_token = crypto.randomBytes(24).toString('hex');

  const user = await prisma.user.create({
    data: { email, password_hash, name, verification_token },
  });

  const verifyUrl = `${FRONTEND_URL}/verify?token=${verification_token}&email=${encodeURIComponent(email)}`;
  await sendEmail(email, 'Verify your account', `Please open: ${verifyUrl}`);

  res.status(201).json({ message: 'account created, check email for verification (dev: email logged to console)' });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const accessToken = signAccessToken(user.id);
  const refreshToken = generateRefreshToken();

  // Store refresh token for revocation
  await prisma.user.update({ where: { id: user.id }, data: { refresh_token: refreshToken } });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });

  res.json({ accessToken });
});

app.post('/auth/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'no refresh token' });

  const user = await prisma.user.findFirst({ where: { refresh_token: token } });
  if (!user) return res.status(401).json({ error: 'invalid refresh token' });

  const accessToken = signAccessToken(user.id);
  res.json({ accessToken });
});

app.post('/auth/logout', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await prisma.user.updateMany({ where: { refresh_token: token }, data: { refresh_token: null } });
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'logged out' });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no auth' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'malformed auth' });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

app.get('/users/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, email: true, name: true, role: true, email_verified: true } });
  if (!user) return res.status(404).json({ error: 'not found' });
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
