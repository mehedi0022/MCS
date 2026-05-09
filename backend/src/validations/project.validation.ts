import * as yup from "yup"

export type ProjectInput = {
  title: string
  slug: string
  client?: string
  location?: string
  year?: number
  summary: string
  description?: string
  imageUrl?: string
  isFeatured?: boolean
  isPublished?: boolean
}

export const projectSchema = yup.object({
  title: yup.string().min(2).required(),
  slug: yup.string().min(2).required(),
  client: yup.string().optional(),
  location: yup.string().optional(),
  year: yup.number().integer().optional(),
  summary: yup.string().min(10).required(),
  description: yup.string().optional(),
  imageUrl: yup.string().optional(),
  isFeatured: yup.boolean().optional(),
  isPublished: yup.boolean().optional(),
})

export const projectUpdateSchema = projectSchema.partial()
