import * as yup from "yup"
import { Role } from "@prisma/client"

export const createUserSchema = yup
  .object({
    name: yup.string().trim().required("Name is required"),
    email: yup.string().trim().email("Valid email is required").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: yup
      .mixed<Role>()
      .oneOf(Object.values(Role) as Role[], "Invalid role")
      .required("Role is required"),
  })
  .required()

export type CreateUserInput = yup.InferType<typeof createUserSchema>

export const updateUserStatusSchema = yup
  .object({
    isActive: yup.boolean().required("isActive is required"),
  })
  .required()

export type UpdateUserStatusInput = yup.InferType<typeof updateUserStatusSchema>
