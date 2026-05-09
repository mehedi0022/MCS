import type { AnyObjectSchema } from "yup"

export async function validateBody<T>(schema: AnyObjectSchema, body: unknown) {
  return schema.validate(body, {
    abortEarly: false,
    stripUnknown: true,
  }) as Promise<T>
}

export async function validateParams<T>(schema: AnyObjectSchema, params: unknown) {
  return schema.validate(params, {
    abortEarly: false,
    stripUnknown: true,
  }) as Promise<T>
}
