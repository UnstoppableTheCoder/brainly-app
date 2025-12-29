import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import { fetchLink, generateLink } from "../controllers/link.controller.js";

const router = Router();

router.post("/", authenticate, generateLink);
router.get("/", authenticate, fetchLink);

export default router;
