import * as yup from "yup"

export type JourneyInput = {
  year: string
  title: string
  desc: string
  sortOrder?: number
  isActive?: boolean
}

export const journeySchema = yup.object({
  year: yup.string().trim().required(),
  title: yup.string().trim().required(),
  desc: yup.string().trim().required(),
  sortOrder: yup.number().integer().min(0).default(0),
  isActive: yup.boolean().default(true),
})

export const journeyUpdateSchema = journeySchema.partial()

