import * as yup from "yup"

export type OurStoryInput = {
  sinceLabel: string
  headingLine1: string
  headingLine2: string
  storyHtml: string
  badge: string
  title: string
  isActive?: boolean
}

export const ourStorySchema = yup.object({
  sinceLabel: yup.string().trim().required(),
  headingLine1: yup.string().trim().required(),
  headingLine2: yup.string().trim().required(),
  storyHtml: yup.string().trim().required(),
  badge: yup.string().trim().required(),
  title: yup.string().trim().required(),
  isActive: yup.boolean().default(true),
})

export const ourStoryUpdateSchema = ourStorySchema.partial()
