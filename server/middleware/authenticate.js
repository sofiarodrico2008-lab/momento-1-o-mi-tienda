import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function authenticate(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Debes iniciar sesión para continuar.' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'La sesión expiró o no es válida.' });
  }

  const user = await User.findById(payload.sub).select('_id name email');
  if (!user) return res.status(401).json({ message: 'La sesión ya no es válida.' });
  req.user = user;
  return next();
}
