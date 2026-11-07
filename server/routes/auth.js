import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

function createSession(user, res) {
  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}

router.post('/register', async (req, res) => {
  const body = req.body ?? {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Ingresa un nombre y un correo electrónico válido.' });
  }
  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({ message: 'La contraseña debe tener entre 8 y 72 caracteres.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await User.create({ name, email, password: passwordHash });
    return createSession(user, res);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese correo.' });
    }
    throw error;
  }
});

router.post('/login', async (req, res) => {
  const body = req.body ?? {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'El correo o la contraseña no son correctos.' });
  }
  return createSession(user, res);
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
});

export default router;
