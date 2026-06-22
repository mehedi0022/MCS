import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { DynamicFavicon } from "@/components/layout/DynamicFavicon"
import { SiteSettingsProvider } from "@/context/site-settings-context"

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

// 3. Comprehensive SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://mcs2024.com"),
  title: {
    default:
      "Marine Consultancy Services (MCS) Hydrographic Surveys | Dredging Support | GIS Mapping | Environmental Studies",
    template: "%s | Marine Consultancy Services (MCS)",
  },
  description:
    "Technical Consultancy for Rivers, Ports, Coastal Infrastructure, and Waterway Development Projects.",
  keywords: [
    "Maritime Consulting",
    "Fleet Management",
    "Oceanic Engineering",
    "Shipping Logistics",
    "Maritime Sustainability",
  ],
  authors: [{ name: "Maritime Solutions Team" }],
  creator: "Maritime Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mcs2024.com",
    title:
      "Marine Consultancy Services (MCS) Hydrographic Surveys | Dredging Support | GIS Mapping | Environmental Studies",
    description:
      "Technical Consultancy for Rivers, Ports, Coastal Infrastructure, and Waterway Development Projects.",
    siteName: "Maritime Solutions",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maritime Solutions Consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Marine Consultancy Services (MCS) Hydrographic Surveys | Dredging Support | GIS Mapping | Environmental Studies",
    description:
      "Technical Consultancy for Rivers, Ports, Coastal Infrastructure, and Waterway Development Projects.",
    images: ["/og-image.png"],
    creator: "@maritimesolutions",
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
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
