import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Access",
  description: "Account access for Marine Consultancy Services administrators.",
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

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
