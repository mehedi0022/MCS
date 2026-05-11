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

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined

    if (!originalRequest || originalRequest._retry) {
      throw error
    }

    const status = error.response?.status
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")

    if (status !== 401 || isAuthRoute) {
      throw error
    }

    originalRequest._retry = true

    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = api
        .post("/auth/refresh")
        .then(() => undefined)
        .finally(() => {
          isRefreshing = false
          refreshPromise = null
        })
    }

    await refreshPromise
    return api(originalRequest)
  }
)

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
