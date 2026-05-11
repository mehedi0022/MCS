import * as yup from "yup"

export type WhatWeDoInput = {
  title: string
  summary: string
  iconKey?: string
  sortOrder?: number
  isActive?: boolean
}

export const whatWeDoSchema = yup.object({
  title: yup.string().trim().required(),
  summary: yup.string().trim().required(),
  iconKey: yup.string().trim().default("Anchor"),
  sortOrder: yup.number().integer().min(0).default(0),
  isActive: yup.boolean().default(true),
})

export const whatWeDoUpdateSchema = whatWeDoSchema.partial()

