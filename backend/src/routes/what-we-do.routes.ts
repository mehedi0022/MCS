import { Router } from "express"
import {
  createWhatWeDo,
  deleteWhatWeDo,
  getWhatWeDoAdmin,
  getWhatWeDoPublic,
  updateWhatWeDo,
} from "../controllers/what-we-do.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/", getWhatWeDoPublic)
router.get("/admin", requireAuth, getWhatWeDoAdmin)
router.post("/", requireAuth, createWhatWeDo)
router.put("/:id", requireAuth, updateWhatWeDo)
router.delete("/:id", requireAuth, deleteWhatWeDo)

export default router

