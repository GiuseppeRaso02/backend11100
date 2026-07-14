import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
app.set('trust proxy', 1);
// === Security & middleware ===
app.use(helmet());
app.use(cors({ 
      origin: true, 
      credentials: true 
    }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limit globale
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Rate limit più stretto su /auth (anti brute-force)
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Troppi tentativi, riprova tra qualche minuto" },
  })
);

// === Routes ===
app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/upload", uploadRoutes);

// === 404 ===
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// === Error handler ===
app.use((err, req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Errore interno", details: err.details });
});

// === Start ===
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 API su http://localhost:${PORT}`));
});
