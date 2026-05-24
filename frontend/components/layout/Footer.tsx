"use client"

import React from "react"
import Link from "next/link"
import { Anchor, Mail, Phone, MapPin } from "lucide-react"
import { useSiteSettings } from "@/context/site-settings-context"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { settings } = useSiteSettings()
  const addressLine1 = settings?.officeAddressLine1?.trim() || "Dhaka"
  const addressLine2 = settings?.officeAddressLine2?.trim() || "Bangladesh"
  const primaryEmail = settings?.contactEmails?.[0]?.trim() || "info@mcs2024.com"
  const primaryPhone = settings?.contactPhones?.[0]?.trim() || "+880 1XXX-XXXXXX"
  const socialLinks = (settings?.socialLinks ?? []).filter(
    (item) => item?.platform?.trim() && item?.url?.trim()
  )

  return (
    <footer className="bg-maritime-surface texture-maritime-noise relative overflow-hidden border-t border-border/30 pt-16 pb-8 dark:bg-maritime-abyss">
      {/* Premium Top Edge Glow */}
      <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-maritime-ocean/30 to-transparent dark:via-maritime-teal/40" />

      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-maritime-navy/5 blur-[100px] dark:bg-maritime-ocean/15" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-1.5 transition-transform group-hover:rotate-12 dark:bg-white/5">
                <Anchor className="h-5 w-5 text-primary dark:text-maritime-foam" />
              </div>
              <span className="text-xl font-bold tracking-tight text-maritime-navy dark:text-maritime-horizon">
                MCS
              </span>
            </Link>
            <p className="max-w-xs leading-relaxed text-muted-foreground">
              Marine Consultancy Services (MCS) delivers integrated
              hydrographic, geospatial, and waterway consultancy solutions
              across Bangladesh.
            </p>
            <div className="flex gap-4">
              {socialLinks.length > 0 ? (
                socialLinks.slice(0, 3).map((item) => (
                  <Link
                    key={`${item.platform}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border/50 bg-background/50 p-2 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-maritime-foam"
                    aria-label={item.platform}
                  >
                    <Anchor className="h-4 w-4" />
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="#"
                    className="rounded-full border border-border/50 bg-background/50 p-2 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-maritime-foam"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="rounded-full border border-border/50 bg-background/50 p-2 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-maritime-foam"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="rounded-full border border-border/50 bg-background/50 p-2 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-maritime-foam"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase dark:text-maritime-horizon">
              Company
            </h4>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "/about-us" },
                { label: "Our Projects", href: "/projects" },
                { label: "Clients & Sectors", href: "/clients-sectors" },
                { label: "Training", href: "/training" },
                { label: "FAQ", href: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary dark:hover:text-maritime-foam"
                  >
                    <span className="h-px w-0 bg-primary transition-all group-hover:w-3 dark:bg-maritime-teal" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase dark:text-maritime-horizon">
              Services
            </h4>
            <ul className="space-y-4">
              {[
                "Hydrographic Surveys",
                "Dredging Monitoring",
                "GIS & Mapping",
                "Environmental Studies",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary dark:hover:text-maritime-foam"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase dark:text-maritime-horizon">
              Contact Us
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maritime-ocean dark:text-maritime-teal" />
                <span>{addressLine1}, {addressLine2}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-maritime-ocean dark:text-maritime-teal" />
                <span>{primaryEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-maritime-ocean dark:text-maritime-teal" />
                <span>{primaryPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 text-xs text-muted-foreground md:flex-row md:text-sm">
          <p>
            © {currentYear} Marine Consultancy Services (MCS). All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground dark:hover:text-maritime-foam"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground dark:hover:text-maritime-foam"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// --- Custom Brand Icons (Matches Lucide Design System) ---

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
