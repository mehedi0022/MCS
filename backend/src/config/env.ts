import dotenv from "dotenv"
import * as yup from "yup"

dotenv.config()

const urlSchema = yup
  .string()
  .required()
  .test("is-url", "${path} must be a valid URL", (value) => {
    if (!value) {
      return false
    }

    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  })

const envSchema = yup.object({
  PORT: yup.number().default(5000),
  NODE_ENV: yup
    .string()
    .oneOf(["development", "test", "production"])
    .default("development"),
  FRONTEND_URL: urlSchema.default("http://localhost:3000"),
  DATABASE_URL: yup.string().required("DATABASE_URL is required"),
  JWT_SECRET: yup
    .string()
    .min(24, "JWT_SECRET must be at least 24 characters")
    .required("JWT_SECRET is required"),
  JWT_EXPIRES_IN: yup.string().default("7d"),
  COOKIE_NAME: yup.string().default("mcs_admin_token"),
  CLOUDINARY_CLOUD_NAME: yup.string().optional(),
  CLOUDINARY_API_KEY: yup.string().optional(),
  CLOUDINARY_API_SECRET: yup.string().optional(),
  CLOUDINARY_FOLDER: yup.string().default("mcs"),
  SMTP_HOST: yup.string().default("smtp.gmail.com"),
  SMTP_PORT: yup.number().default(587),
  SMTP_SECURE: yup.boolean().default(false),
  SMTP_USER: yup.string().optional(),
  SMTP_PASS: yup.string().optional(),
  SMTP_FROM_NAME: yup.string().default("MCS Team"),
})

export const env = envSchema.validateSync(process.env, {
  abortEarly: false,
  stripUnknown: true,
})
