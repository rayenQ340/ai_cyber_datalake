const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 3600 * 1000,
};
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e || '');
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const sign = (res, u) => res.cookie('token', jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }), cookieOpts);

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Enter your full name.' });
    if (!emailOk(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (!password || password.length < 8) return res.status(400).json({ message: 'Use at least 8 characters for your password.' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, role, password: await bcrypt.hash(password, 12) });
    sign(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = emailOk(email) && password ? await User.findOne({ email: email.toLowerCase() }) : null;
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    sign(res, user);
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Please log in.' });
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', { ...cookieOpts, maxAge: undefined });
  res.json({ ok: true });
});

module.exports = router;
