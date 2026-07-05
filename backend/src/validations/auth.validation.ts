import * as yup from "yup"

export type LoginInput = {
  email: string
  password: string
  rememberMe?: boolean
}

export type ForgotPasswordInput = {
  email: string
}

export type ResetPasswordInput = {
  token: string
  password: string
}

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  rememberMe: yup.boolean().optional(),
})

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Valid email is required")
    .required("Email is required"),
})

export const resetPasswordSchema = yup.object({
  token: yup.string().trim().min(32, "Invalid reset token").required("Reset token is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
})
