import * as yup from "yup"

export type LoginInput = {
  email: string
  password: string
  rememberMe?: boolean
}

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  rememberMe: yup.boolean().optional(),
})
