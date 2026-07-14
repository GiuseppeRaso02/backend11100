import { z } from "zod";
import Request from "../models/Request.js";

export const requestSchema = z.object({
  contact: z.object({
    name: z.string().min(1).max(100),
    phone: z.string().min(4).max(40),
    email: z.string().email(),
    notes: z.string().max(1000).optional().default(""),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        name: z.string(),
        size: z.string(),
        price: z.number().min(0),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "Almeno un prodotto richiesto"),
});

// POST /api/requests
export const create = async (req, res) => {
  const total = req.body.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const doc = await Request.create({
    ...req.body,
    user: req.user?._id || null,
    total,
  });
  res.status(201).json(doc);
};

// GET /api/requests  (admin)
export const list = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const requests = await Request.find(filter).sort({ createdAt: -1 }).populate("user", "email name");
  res.json(requests);
};

// PATCH /api/requests/:id  (admin)
export const updateStatus = async (req, res) => {
  const allowed = ["pending", "contacted", "confirmed", "closed"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ error: "Status non valido" });
  }
  const r = await Request.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!r) return res.status(404).json({ error: "Richiesta non trovata" });
  res.json(r);
};
