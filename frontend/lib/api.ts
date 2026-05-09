import axios, { AxiosError } from "axios"

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  issues?: unknown
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Partial<ApiResponse<unknown>> | undefined
    return data?.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Request failed"
}
