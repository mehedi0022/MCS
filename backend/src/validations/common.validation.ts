import * as yup from "yup"

export type IdParams = {
  id: string
}

export const idParamsSchema = yup.object({
  id: yup.string().required(),
})
