import * as yup from "yup"

export type MessageInput = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export type MessageStatusInput = {
  status: "NEW" | "READ" | "ARCHIVED"
}

export type MessageReplyInput = {
  replyMessage: string
  subject?: string
}

export const messageSchema = yup.object({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  phone: yup.string().optional(),
  subject: yup.string().optional(),
  message: yup.string().min(10).required(),
})

export const messageStatusSchema = yup.object({
  status: yup.string().oneOf(["NEW", "READ", "ARCHIVED"]).required(),
})

export const messageReplySchema = yup.object({
  replyMessage: yup.string().min(10).required(),
  subject: yup.string().optional(),
})
