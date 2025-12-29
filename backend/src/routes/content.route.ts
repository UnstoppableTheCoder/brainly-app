import { Router } from "express";
import {
  addContent,
  deleteContent,
  getContents,
  getContentsByLink,
  updateContent,
} from "../controllers/content.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(authenticate, addContent).get(authenticate, getContents);
router.route("/:hash").get(getContentsByLink);
router
  .route("/:contentId")
  .put(authenticate, updateContent)
  .delete(authenticate, deleteContent);

export default router;
