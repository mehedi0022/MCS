import * as yup from "yup"

export type TrainingPageInput = {
  heroBadge: string
  heroTitleLine1: string
  heroTitleHighlight: string
  heroDescription: string
  snapshotEyebrow?: string
  learningPathTitle?: string
  outcomesTitle?: string
  ctaTitle: string
  ctaDescription: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  isActive?: boolean
}

export type TrainingItemInput = {
  section: string
  title: string
  description?: string
  iconKey?: string
  value?: string
  sortOrder?: number
  isActive?: boolean
}

export const trainingPageSchema = yup.object({
  heroBadge: yup.string().trim().required(),
  heroTitleLine1: yup.string().trim().required(),
  heroTitleHighlight: yup.string().trim().required(),
  heroDescription: yup.string().trim().required(),
  snapshotEyebrow: yup.string().trim().default("Program Snapshot"),
  learningPathTitle: yup.string().trim().default("Learning Path"),
  outcomesTitle: yup.string().trim().default("Expected Outcomes"),
  ctaTitle: yup.string().trim().required(),
  ctaDescription: yup.string().trim().required(),
  primaryButtonText: yup.string().trim().default("Request Training Plan"),
  primaryButtonLink: yup.string().trim().default("/contact"),
  secondaryButtonText: yup.string().trim().default("View FAQ"),
  secondaryButtonLink: yup.string().trim().default("/faq"),
  isActive: yup.boolean().default(true),
})

export const trainingPageUpdateSchema = trainingPageSchema.partial()

export const trainingItemSchema = yup.object({
  section: yup
    .string()
    .trim()
    .oneOf(["AREA", "MODE", "STEP", "OUTCOME", "STAT"])
    .required(),
  title: yup.string().trim().required(),
  description: yup.string().trim().nullable().transform((value) => value ?? ""),
  iconKey: yup.string().trim().nullable().transform((value) => value ?? ""),
  value: yup.string().trim().nullable().transform((value) => value ?? ""),
  sortOrder: yup.number().integer().min(0).default(0),
  isActive: yup.boolean().default(true),
})

export const trainingItemUpdateSchema = trainingItemSchema.partial()
