// Crea il primo admin leggendo ADMIN_EMAIL e ADMIN_PASSWORD da .env
// Esegui con: npm run seed:admin
import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const run = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("✗ ADMIN_EMAIL e ADMIN_PASSWORD obbligatori in .env");
    process.exit(1);
  }
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    if (password) existing.password = password;
    await existing.save();
    console.log(`✓ Admin aggiornato: ${email}`);
  } else {
    await User.create({ email, password, role: "admin", name: "Admin" });
    console.log(`✓ Admin creato: ${email}`);
  }
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
