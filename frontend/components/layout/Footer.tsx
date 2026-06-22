"use client"

import React from "react"
import Link from "next/link"
import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react"
import { useSiteSettings } from "@/context/site-settings-context"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { getVisibleSocialLinks } from "@/lib/social-links"
import { api, getApiErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DEFAULT_FOOTER_BRAND_TEXT =
  "Marine Consultancy Services (MCS) delivers integrated hydrographic, geospatial, and waterway consultancy solutions across Bangladesh."

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [subscribeEmail, setSubscribeEmail] = React.useState("")
  const [isSubscribing, setIsSubscribing] = React.useState(false)
  const [subscribeMessage, setSubscribeMessage] = React.useState("")
  const [subscribeError, setSubscribeError] = React.useState("")
  const { settings } = useSiteSettings()
  const addressLine1 = settings?.officeAddressLine1?.trim() || "Dhaka"
  const addressLine2 = settings?.officeAddressLine2?.trim() || "Bangladesh"
  const primaryEmail =
    settings?.contactEmails?.[0]?.trim() || "info@mcs2024.com"
  const primaryPhone =
    settings?.contactPhones?.[0]?.trim() || "+880 1XXX-XXXXXX"
  const footerBrandText =
    settings?.footerBrandText?.trim() || DEFAULT_FOOTER_BRAND_TEXT
  const socialLinks = getVisibleSocialLinks(settings?.socialLinks)

  async function handleSubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubscribeError("")
    setSubscribeMessage("")
    setIsSubscribing(true)

    try {
      await api.post("/messages", {
        name: "Newsletter Subscriber",
        email: subscribeEmail,
        subject: "Newsletter Subscription",
        message:
          "Please add this email to the MCS newsletter subscription list.",
      })

      setSubscribeEmail("")
      setSubscribeMessage("Subscribed successfully.")
    } catch (error) {
      setSubscribeError(getApiErrorMessage(error))
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-maritime-surface texture-maritime-noise relative overflow-hidden border-t border-border/30 pt-16 pb-8 dark:bg-maritime-abyss">
      {/* Premium Top Edge Glow */}
      <div className="absolute inset-x-0 top-0 h-px w-full bg-linear-to-r from-transparent via-maritime-ocean/30 to-transparent dark:via-maritime-teal/40" />

      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-100 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-maritime-navy/5 blur-[100px] dark:bg-maritime-ocean/15" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[minmax(320px,1.45fr)_minmax(150px,0.8fr)_minmax(160px,0.85fr)_minmax(240px,1fr)] xl:grid-cols-[minmax(360px,1.5fr)_minmax(160px,0.75fr)_minmax(170px,0.8fr)_minmax(260px,1fr)]">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex">
              <BrandLogo
                lightSrc={settings?.logoUrl}
                darkSrc={settings?.darkLogoUrl}
                className="h-12 w-40 sm:w-44"
              />
              <span className="sr-only">Marine Consultancy Services</span>
            </Link>
            <p className="max-w-sm leading-relaxed text-muted-foreground">
              {footerBrandText}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((item) => {
                  const Icon = socialIconMap[item.platform]
                  if (!Icon) return null

                  return (
                    <Link
                      key={`${item.platform}-${item.url}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-border/50 bg-background/50 p-2 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-maritime-foam"
                      aria-label={item.platform}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase dark:text-maritime-horizon">
              Useful Links
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
                <span>
                  {addressLine1}, {addressLine2}
                </span>
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
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  required
                  type="email"
                  placeholder="Email address"
                  value={subscribeEmail}
                  onChange={(event) => setSubscribeEmail(event.target.value)}
                  className="h-10 rounded-lg bg-background/70 text-sm"
                />
                <Button
                  type="submit"
                  size="icon-sm"
                  disabled={isSubscribing}
                  aria-label="Subscribe"
                  className="h-10 w-10 rounded-lg"
                >
                  {isSubscribing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
              {(subscribeMessage || subscribeError) && (
                <p
                  className={
                    subscribeError
                      ? "text-xs font-medium text-destructive"
                      : "text-xs font-medium text-emerald-600 dark:text-emerald-300"
                  }
                >
                  {subscribeError || subscribeMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 text-xs text-muted-foreground md:flex-row md:text-sm">
          <p>
            © {currentYear} Marine Consultancy Services (MCS). All rights
            reserved.
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

// --- Social Brand Icons ---

const socialIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  LinkedIn: LinkedinIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  YouTube: YoutubeIcon,
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M14 8.5h2V5h-2.4C10.7 5 9 6.7 9 9.6V12H7v3.5h2V22h4v-6.5h2.6L16 12h-3V9.8c0-.9.3-1.3 1-1.3Z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
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

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2.5 8.5A4 4 0 0 1 6.3 5h11.4a4 4 0 0 1 3.8 3.5 24 24 0 0 1 0 7 4 4 0 0 1-3.8 3.5H6.3a4 4 0 0 1-3.8-3.5 24 24 0 0 1 0-7Z" />
      <path d="m10 9 5 3-5 3Z" />
    </svg>
  )
}
