"use client"

import { useEffect } from "react"
import { useSiteSettings } from "@/context/site-settings-context"

const faviconRels = [
  "icon",
  "shortcut icon",
  "apple-touch-icon",
  "mask-icon",
]

function versionUrl(url: string) {
  const separator = url.includes("?") ? "&" : "?"

  return `${url}${separator}v=${Date.now()}`
}

function removeExistingFavicons() {
  document.head
    .querySelectorAll<HTMLLinkElement>(
      faviconRels.map((rel) => `link[rel="${rel}"]`).join(",")
    )
    .forEach((link) => link.remove())
}

function appendFaviconLink({
  rel,
  href,
  type,
  sizes,
}: {
  rel: string
  href: string
  type?: string
  sizes?: string
}) {
  const link = document.createElement("link")

  link.setAttribute("rel", rel)
  link.setAttribute("href", href)

  if (type) {
    link.setAttribute("type", type)
  }

  if (sizes) {
    link.setAttribute("sizes", sizes)
  }

  document.head.appendChild(link)
}

export function DynamicFavicon() {
  const { settings } = useSiteSettings()

  useEffect(() => {
    const raw = settings?.faviconUrl?.trim()
    if (!raw) return

    const versioned = versionUrl(raw)

    removeExistingFavicons()
    appendFaviconLink({
      rel: "icon",
      href: versioned,
      type: "image/png",
      sizes: "any",
    })
    appendFaviconLink({
      rel: "shortcut icon",
      href: versioned,
      type: "image/png",
    })
    appendFaviconLink({
      rel: "apple-touch-icon",
      href: versioned,
      sizes: "512x512",
    })

    document
      .querySelector('meta[name="msapplication-TileImage"]')
      ?.setAttribute("content", versioned)
  }, [settings?.faviconUrl])

  return null
}
