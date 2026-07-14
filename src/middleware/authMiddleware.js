import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifica che l'utente sia loggato (JWT valido)
export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token mancante" });
    }
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "Utente non trovato" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
};

// Verifica che l'utente sia admin (usare DOPO authMiddleware)
export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accesso riservato agli admin" });
  }
  next();
};

// Auth opzionale: se c'è token lo decodifica, sennò continua
export const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      const token = header.slice(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (_) {}
  next();
};
