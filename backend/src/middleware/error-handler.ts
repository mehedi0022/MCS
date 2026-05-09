import type { ErrorRequestHandler } from "express"
import { ValidationError } from "yup"
import { ApiError } from "../utils/api.js"

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ValidationError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      issues: error.errors,
    })
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    })
  }

  console.error(error)

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  })
}
