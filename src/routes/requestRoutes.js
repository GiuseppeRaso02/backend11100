import { Router } from "express";
import * as ctrl from "../controllers/requestController.js";
import { authMiddleware, adminMiddleware, optionalAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { requestSchema } from "../controllers/requestController.js";

const router = Router();

// Chiunque può inviare una richiesta (anche guest)
router.post("/", optionalAuth, validate(requestSchema), ctrl.create);

// Admin: vedi e gestisci richieste
router.get("/", authMiddleware, adminMiddleware, ctrl.list);
router.patch("/:id", authMiddleware, adminMiddleware, ctrl.updateStatus);

export default router;
