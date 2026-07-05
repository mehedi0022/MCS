import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MCS Admin",
  description: "Protected administration area for Marine Consultancy Services.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: null,
  twitter: null,
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
