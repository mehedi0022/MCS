import * as yup from "yup"

export type ServiceInput = {
  title: string
  slug: string
  summary: string
  description?: string
  icon?: string
  isFeatured?: boolean
  isPublished?: boolean
}

export const serviceSchema = yup.object({
  title: yup.string().min(2).required(),
  slug: yup.string().min(2).required(),
  summary: yup.string().min(10).required(),
  description: yup.string().optional(),
  icon: yup.string().optional(),
  isFeatured: yup.boolean().optional(),
  isPublished: yup.boolean().optional(),
})

export const serviceUpdateSchema = serviceSchema.partial()
