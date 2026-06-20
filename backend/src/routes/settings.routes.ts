import { Router } from "express"
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getSettings)
router.put(
  "/",
  requireAuth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "darkLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateSettings
)

export default router
