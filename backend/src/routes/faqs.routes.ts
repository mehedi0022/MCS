import { Router } from "express"
import {
  createFaq,
  deleteFaq,
  getAdminFaqs,
  getPublicFaqs,
  updateFaq,
} from "../controllers/faq.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/", getPublicFaqs)
router.get("/admin", requireAuth, getAdminFaqs)
router.post("/", requireAuth, createFaq)
router.put("/:id", requireAuth, updateFaq)
router.delete("/:id", requireAuth, deleteFaq)

export default router
