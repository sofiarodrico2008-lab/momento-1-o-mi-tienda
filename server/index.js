import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';

const { MONGODB_URI, JWT_SECRET } = process.env;
if (!MONGODB_URI) throw new Error('Configura MONGODB_URI en server/.env.');
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('Configura JWT_SECRET con al menos 32 caracteres en server/.env.');
}

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Ocurrió un error interno. Inténtalo de nuevo.' });
});

const port = Number(process.env.PORT) || 5000;
try {
  await mongoose.connect(MONGODB_URI);
  app.listen(port, () => {
    console.log(`API lista en http://localhost:${port}`);
  });
} catch (error) {
  console.error('No se pudo conectar a MongoDB:', error.message);
  process.exitCode = 1;
}
