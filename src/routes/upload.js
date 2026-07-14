import { Router } from "express";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { upload } from "../middleware/upload.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Usiamo i tuoi middleware corretti: authMiddleware e adminMiddleware
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Nessun file selezionato" });

  const stream = cloudinary.uploader.upload_stream(
    { folder: "11100store/products", resource_type: "image" },
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ url: result.secure_url, publicId: result.public_id });
    }
  );
  
  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

export default router;