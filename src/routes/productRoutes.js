import { Router } from "express";
import * as ctrl from "../controllers/productController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

// Pubbliche
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);

// Admin only
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), ctrl.create);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), ctrl.update);
router.delete("/:id", authMiddleware, adminMiddleware, ctrl.remove);

export default router;
