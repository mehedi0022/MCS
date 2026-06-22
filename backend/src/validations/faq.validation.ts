import * as yup from "yup"

export type FaqInput = {
  category: string
  question: string
  answer: string
  sortOrder?: number
  isActive?: boolean
}

export const faqSchema = yup.object({
  category: yup.string().trim().required(),
  question: yup.string().trim().required(),
  answer: yup.string().trim().required(),
  sortOrder: yup.number().integer().min(0).default(0),
  isActive: yup.boolean().default(true),
})

export const faqUpdateSchema = faqSchema.partial()
