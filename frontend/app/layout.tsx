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
  metadataBase: new URL("https://mcs.meetmehedi.dev"), // Replace with your actual domain
  title: {
    default: "Maritime Solutions | Premium Consulting & Logistics",
    template: "%s | Maritime Solutions", // Automatically appends the brand to page titles
  },
  description:
    "High-end maritime consulting, fleet management, oceanic engineering, and sustainable logistics strategies for the modern maritime industry.",
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
    url: "https://mcs.meetmehedi.dev",
    title: "Maritime Solutions | Premium Consulting & Logistics",
    description:
      "Leading the horizon in maritime consulting. Professional solutions for logistics, fleet management, and engineering.",
    siteName: "Maritime Solutions",
    images: [
      {
        url: "/og-image.jpg", // Add a 1200x630px image to your /public folder
        width: 1200,
        height: 630,
        alt: "Maritime Solutions Consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maritime Solutions | Premium Consulting",
    description: "High-end maritime consulting and logistics strategies.",
    images: ["/og-image.jpg"],
    creator: "@maritimesolutions", // Replace with your Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
