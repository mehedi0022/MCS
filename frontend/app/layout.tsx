import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { DynamicFavicon } from "@/components/layout/DynamicFavicon"
import { SiteSettingsProvider } from "@/context/site-settings-context"
import { FloatingActions } from "@/components/layout/FloatingActions"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  createJsonLdGraph,
  createOrganizationSchema,
  createWebSiteSchema,
  siteConfig,
} from "@/lib/seo"

// 1. Premium SaaS Font Pairing
const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

// 2. Viewport Configuration (Mobile & Theme colors)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E14" }, // Maps to your dark background
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

const globalStructuredData = createJsonLdGraph([
  createOrganizationSchema(),
  createWebSiteSchema(),
])

// 3. Comprehensive SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} preview image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        alt: `${siteConfig.name} preview image`,
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "min-h-screen scroll-smooth antialiased",
        fontSans.variable,
        fontHeading.variable,
        fontMono.variable
      )}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <JsonLd data={globalStructuredData} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteSettingsProvider>
            <DynamicFavicon />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingActions />
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
