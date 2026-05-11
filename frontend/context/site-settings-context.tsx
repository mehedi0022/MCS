"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"

export type SocialLink = {
  platform: string
  url: string
}

export type SiteSettings = {
  logoUrl?: string | null
  faviconUrl?: string | null
  officeAddressLine1?: string | null
  officeAddressLine2?: string | null
  mapLocation?: string | null
  mapLocationText?: string | null
  contactEmails?: string[] | null
  contactPhones?: string[] | null
  branches?: string[] | null
  socialLinks?: SocialLink[] | null
}

type SiteSettingsContextValue = {
  settings: SiteSettings | null
  isLoading: boolean
  error: string
  refreshSettings: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(
  undefined
)

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const refreshSettings = useCallback(async () => {
    try {
      setError("")
      setIsLoading(true)
      const response = await api.get<ApiResponse<SiteSettings>>("/settings")
      setSettings(response.data.data)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSettings()
  }, [refreshSettings])

  const value = useMemo(
    () => ({ settings, isLoading, error, refreshSettings }),
    [settings, isLoading, error, refreshSettings]
  )

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider")
  }
  return context
}

