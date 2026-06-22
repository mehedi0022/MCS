import * as yup from "yup"

export type DeliveryApproachSectionInput = {
  eyebrow: string
  title: string
  isActive?: boolean
}

export type DeliveryApproachStepInput = {
  title: string
  description: string
  iconKey?: string
  sortOrder?: number
  isActive?: boolean
}

export const deliveryApproachSectionSchema = yup.object({
  eyebrow: yup.string().trim().min(2).required(),
  title: yup.string().trim().min(2).required(),
  isActive: yup.boolean().default(true),
})

export const deliveryApproachStepSchema = yup.object({
  title: yup.string().trim().min(2).required(),
  description: yup.string().trim().min(10).required(),
  iconKey: yup.string().trim().default("Search"),
  sortOrder: yup.number().integer().min(0).default(0),
  isActive: yup.boolean().default(true),
})

export const deliveryApproachSectionUpdateSchema =
  deliveryApproachSectionSchema.partial()

export const deliveryApproachStepUpdateSchema =
  deliveryApproachStepSchema.partial()
