import type { Metadata } from "next"

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mcs2024.com").replace(
    /\/+$/,
    ""
  ),
  name: "Marine Consultancy Services (MCS)",
  shortName: "MCS",
  defaultTitle: "Marine Consultancy Services | Hydrographic Surveys & GIS",
  description:
    "Technical consultancy for rivers, ports, coastal infrastructure, hydrographic surveys, GIS mapping, dredging support, and waterway development in Bangladesh.",
  locale: "en_US",
  language: "en",
  defaultOgImage: "/og-image.png",
  logo: "/mcs_logo.png",
  email: "macsbd.survey@gmail.com",
  addressLocality:
    "Mirpur 11, Metro Station Pillar No: 205, 6th Floor Uttara Bank Building, Dhaka-1216, Bangladesh",
  addressCountry: "BD",
  keywords: [
    "Marine Consultancy Services",
    "MCS Bangladesh",
    "hydrographic survey Bangladesh",
    "bathymetric survey",
    "dredging monitoring",
    "GIS mapping",
    "coastal engineering",
    "environmental studies",
    "waterway development",
    "marine consultancy",
  ],
}

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  image?: string | null
  imageAlt?: string
  keywords?: string[]
  openGraphType?: "website" | "article"
  publishedTime?: string | null
  modifiedTime?: string | null
  noIndex?: boolean
}

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[]

export type JsonLdObject = {
  [key: string]: JsonLdValue | undefined
}

export function absoluteUrl(path = "/") {
  if (!path) return siteConfig.url

  try {
    return new URL(path, `${siteConfig.url}/`).toString()
  } catch {
    return siteConfig.url
  }
}

export function cleanText(value = "") {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()
}

export function truncateText(value = "", maxLength = 160) {
  const text = cleanText(value)

  if (text.length <= maxLength) {
    return text
  }

  const clipped = text.slice(0, maxLength + 1)
  const boundary = clipped.lastIndexOf(" ")
  const end = boundary > 80 ? boundary : maxLength

  return `${clipped.slice(0, end).trim()}...`
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  keywords = [],
  openGraphType = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path)
  const metaTitle = cleanText(title)
  const metaDescription = truncateText(description)
  const shareTitle = `${metaTitle} | ${siteConfig.name}`
  const shareImage = absoluteUrl(image || siteConfig.defaultOgImage)
  const shareImageAlt = imageAlt || `${siteConfig.name} preview image`
  const robots = noIndex
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }

  const openGraph =
    openGraphType === "article"
      ? {
          type: "article" as const,
          url: canonical,
          title: shareTitle,
          description: metaDescription,
          siteName: siteConfig.name,
          locale: siteConfig.locale,
          publishedTime: publishedTime || undefined,
          modifiedTime: modifiedTime || undefined,
          images: [
            {
              url: shareImage,
              width: 1200,
              height: 630,
              alt: shareImageAlt,
            },
          ],
        }
      : {
          type: "website" as const,
          url: canonical,
          title: shareTitle,
          description: metaDescription,
          siteName: siteConfig.name,
          locale: siteConfig.locale,
          images: [
            {
              url: shareImage,
              width: 1200,
              height: 630,
              alt: shareImageAlt,
            },
          ],
        }

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical,
    },
    robots,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: metaDescription,
      images: [
        {
          url: shareImage,
          alt: shareImageAlt,
        },
      ],
    },
  }
}

export function createOrganizationSchema(): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("#organization"),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.addressLocality,
      addressCountry: siteConfig.addressCountry,
    },
  }
}

export function createWebSiteSchema(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("#website"),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: {
      "@id": absoluteUrl("#organization"),
    },
  }
}

export function createWebPageSchema({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string
  name: string
  description: string
  type?: string
}): JsonLdObject {
  const url = absoluteUrl(path)

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description: truncateText(description, 220),
    inLanguage: siteConfig.language,
    isPartOf: {
      "@id": absoluteUrl("#website"),
    },
    publisher: {
      "@id": absoluteUrl("#organization"),
    },
  }
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(items.at(-1)?.path || "/")}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function createJsonLdGraph(items: JsonLdObject[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": items,
  }
}
