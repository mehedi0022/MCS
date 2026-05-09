import { Router } from "express"
import {
  createHeroSlide,
  deleteHeroSlide,
  getAdminHeroSlides,
  getPublicHeroSlides,
  updateHeroSlide,
} from "../controllers/hero-slide.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getPublicHeroSlides)
router.get("/admin", requireAuth, getAdminHeroSlides)
router.post("/", requireAuth, upload.single("file"), createHeroSlide)
router.put("/:id", requireAuth, upload.single("file"), updateHeroSlide)
router.delete("/:id", requireAuth, deleteHeroSlide)

export default router
