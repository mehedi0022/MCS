"use client"

import { useEffect } from "react"
import { useSiteSettings } from "@/context/site-settings-context"

function upsertLink(rel: string, href: string) {
  let link = document.head.querySelector(
    `link[rel="${rel}"]`
  ) as HTMLLinkElement | null

  if (!link) {
    link = document.createElement("link")
    link.setAttribute("rel", rel)
    document.head.appendChild(link)
  }

  link.setAttribute("href", href)
}

export function DynamicFavicon() {
  const { settings } = useSiteSettings()

  useEffect(() => {
    const raw = settings?.faviconUrl?.trim()
    if (!raw) return

    // Bust favicon cache so browsers pick up updates immediately.
    const versioned = raw.includes("?")
      ? `${raw}&v=${Date.now()}`
      : `${raw}?v=${Date.now()}`

    upsertLink("icon", versioned)
    upsertLink("shortcut icon", versioned)
    upsertLink("apple-touch-icon", versioned)
  }, [settings?.faviconUrl])

  return null
}
