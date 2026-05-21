import * as yup from "yup"

export type ClientInput = {
  name: string
  logoUrl?: string
  website?: string
  isFeatured?: boolean
  isPublished?: boolean
}

export const clientSchema = yup.object({
  name: yup.string().trim().min(2).required(),
  logoUrl: yup.string().trim().url().optional(),
  website: yup.string().trim().url().optional(),
  isFeatured: yup.boolean().optional(),
  isPublished: yup.boolean().optional(),
})

export const clientUpdateSchema = clientSchema.partial()
