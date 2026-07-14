import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimo 8 caratteri"),
  name: z.string().trim().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email già registrata" });

  const user = await User.create({ email, password, name, role: "user" });
  const token = signToken(user);
  res.status(201).json({ token, user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }
  const token = signToken(user);
  res.json({ token, user });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
