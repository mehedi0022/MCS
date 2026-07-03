import { Router } from "express"
import {
  downloadCompanyProfile,
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getSettings)
router.get("/company-profile/download", downloadCompanyProfile)
router.put(
  "/",
  requireAuth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "darkLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "companyProfile", maxCount: 1 },
  ]),
  updateSettings
)

export default router
