import { Router } from "express"
import {
  createMessage,
  deleteMessage,
  getMessages,
  restoreMessage,
  replyToMessage,
  updateMessageStatus,
} from "../controllers/message.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.post("/", createMessage)
router.get("/", requireAuth, getMessages)
router.patch("/:id/status", requireAuth, updateMessageStatus)
router.post("/:id/reply", requireAuth, replyToMessage)
router.post("/:id/restore", requireAuth, restoreMessage)
router.delete("/:id", requireAuth, deleteMessage)

export default router
