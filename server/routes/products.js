import { Router } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ products });
});

router.post('/', async (req, res) => {
  const body = req.body ?? {};
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const categoria = typeof body.categoria === 'string' ? body.categoria.trim() : '';
  const precio = Number(body.precio);

  if (!nombre || nombre.length > 100 || !categoria || categoria.length > 60 ||
      !Number.isFinite(precio) || precio < 1) {
    return res.status(400).json({ message: 'Revisa el nombre, la categoría y el precio del producto.' });
  }

  const product = await Product.create({ nombre, categoria, precio });
  return res.status(201).json({ product });
});

router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'El identificador del producto no es válido.' });
  }
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'No se encontró el producto.' });
  return res.status(204).end();
});

export default router;
