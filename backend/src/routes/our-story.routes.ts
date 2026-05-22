import { Router } from "express"
import {
  getOurStoryAdmin,
  getOurStoryPublic,
  patchOurStory,
  upsertOurStory,
} from "../controllers/our-story.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getOurStoryPublic)
router.get("/admin", requireAuth, getOurStoryAdmin)
router.post("/", requireAuth, upload.single("file"), upsertOurStory)
router.put("/", requireAuth, upload.single("file"), upsertOurStory)
router.patch("/", requireAuth, upload.single("file"), patchOurStory)

export default router
