import { z } from "zod";
import Product from "../models/Product.js";
import { cloudinary } from "../config/cloudinary.js";

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  brand: z.string().optional(),
  category: z.enum(["Hoodie", "Tee", "Pants", "Footwear", "Outerwear", "Accessories"]),
  price: z.coerce.number().min(0),
  description: z.string().optional().default(""),
  stock: z.coerce.number().int().min(0).default(0),
  sizes: z.union([z.array(z.string()), z.string()]).optional(),
  drop: z.string().optional().default(""),
  active: z.coerce.boolean().optional().default(true),
});

const normalizeSizes = (sizes) => {
  if (!sizes) return [];
  if (Array.isArray(sizes)) return sizes;
  return sizes.split(",").map((s) => s.trim()).filter(Boolean);
};

// GET /api/products
export const list = async (req, res) => {
  const { category, q, active } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (active !== undefined) filter.active = active === "true";
  if (q) filter.name = { $regex: q, $options: "i" };
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

// GET /api/products/:id
export const getOne = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Prodotto non trovato" });
  res.json(product);
};

// POST /api/products  (admin)
export const create = async (req, res) => {
  const data = { ...req.body, sizes: normalizeSizes(req.body.sizes) };
  if (req.file) {
    data.image = req.file.path;
    data.imagePublicId = req.file.filename;
  }
  const product = await Product.create(data);
  res.status(201).json(product);
};

// PUT /api/products/:id  (admin)
export const update = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Prodotto non trovato" });

  const data = { ...req.body, sizes: normalizeSizes(req.body.sizes) };
  if (req.file) {
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (_) {}
    }
    data.image = req.file.path;
    data.imagePublicId = req.file.filename;
  }
  Object.assign(product, data);
  await product.save();
  res.json(product);
};

// DELETE /api/products/:id  (admin)
export const remove = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Prodotto non trovato" });
  if (product.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
    } catch (_) {}
  }
  await product.deleteOne();
  res.json({ ok: true });
};
