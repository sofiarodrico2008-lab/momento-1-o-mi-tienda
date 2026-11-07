import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 100 },
  precio: { type: Number, required: true, min: 1 },
  categoria: { type: String, required: true, trim: true, maxlength: 60 },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
