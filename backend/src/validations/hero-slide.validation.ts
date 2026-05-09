import * as yup from "yup"

export type HeroSlideInput = {
  badgeText: string
  title: string
  subtitle: string
  imageUrl?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  sortOrder?: number
  isActive?: boolean
}

export const heroSlideSchema = yup.object({
  badgeText: yup.string().min(2).required(),
  title: yup.string().min(4).required(),
  subtitle: yup.string().min(10).required(),
  imageUrl: yup.string().optional(),
  primaryButtonText: yup.string().optional(),
  primaryButtonLink: yup.string().optional(),
  secondaryButtonText: yup.string().optional(),
  secondaryButtonLink: yup.string().optional(),
  sortOrder: yup.number().integer().default(0),
  isActive: yup.boolean().default(true),
})

export const heroSlideUpdateSchema = heroSlideSchema.partial()
