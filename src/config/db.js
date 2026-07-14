import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI non configurato in .env");
    await mongoose.connect(uri);
    console.log("✓ MongoDB connesso");
  } catch (err) {
    console.error("✗ Errore connessione MongoDB:", err.message);
    process.exit(1);
  }
};
