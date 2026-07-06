"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSiteSettings } from "@/context/site-settings-context"
import { BrandLogo } from "@/components/layout/BrandLogo"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Sectors", href: "/clients-sectors" },
  { name: "Training", href: "/training" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { settings } = useSiteSettings()
  const logoUrl = settings?.logoUrl?.trim()
  const darkLogoUrl = settings?.darkLogoUrl?.trim()
  const navbarBrandText = settings?.navbarBrandText?.trim() || "Marine"
  const navbarBrandAccent = settings?.navbarBrandAccent?.trim() || "Consultancy"
  const navbarBrandSubtext =
    settings?.navbarBrandSubtext?.trim() || "Services (MCS)"
  const primaryEmail =
    settings?.contactEmails?.[0]?.trim() || "info@mcs2024.com"
  const companyProfileDownloadUrl = settings?.companyProfileUrl?.trim()
    ? "/api/company-profile"
    : ""

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = mobileMenuOpen ? "hidden" : originalOverflow
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onEscape)
    return () => window.removeEventListener("keydown", onEscape)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out",
        // Scrolled state: Substantial glass effect with a subtle border and shadow
        isScrolled
          ? "border-b border-border/50 bg-background/60 py-3 shadow-sm backdrop-blur-2xl"
          : "border-b border-border/50 bg-background/80 py-4 backdrop-blur-3xl"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group inline-flex min-w-0 items-center gap-2">
          <BrandLogo
            lightSrc={logoUrl}
            darkSrc={darkLogoUrl}
            priority
            className="h-10 w-auto sm:h-11 sm:w-auto lg:w-auto"
          />
          <div className="hidden min-w-0 flex-col leading-none lg:flex">
            <span
              className={cn(
                "text-sm font-bold uppercase transition-colors duration-300 xl:text-base",
                isScrolled
                  ? "text-foreground"
                  : "text-maritime-navy dark:text-white"
              )}
            >
              {navbarBrandText}{" "}
              <span className="font-light">{navbarBrandAccent}</span>
            </span>
            <span
              className={cn(
                "text-[10px] font-medium uppercase transition-colors duration-300",
                isScrolled
                  ? "text-muted-foreground"
                  : "text-maritime-navy/70 dark:text-white/70"
              )}
            >
              {navbarBrandSubtext}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 xl:flex 2xl:gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative text-sm font-bold tracking-wide transition-all duration-300 hover:text-primary",
                  // Ensure visibility on both transparent and scrolled states
                  isScrolled
                    ? isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                    : isActive
                      ? "text-primary"
                      : "text-maritime-navy/80 hover:text-maritime-navy dark:text-white/80 dark:hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full animate-in rounded-full bg-primary fade-in slide-in-from-left-2" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 xl:gap-3 2xl:gap-4">
          <div
            className={cn(
              "cursor-pointer rounded-full border border-border transition-colors duration-300",
              isScrolled
                ? "cursor-pointer text-foreground"
                : "cursor-pointer text-maritime-navy dark:text-white"
            )}
          >
            <ThemeToggle />
          </div>

          {companyProfileDownloadUrl && (
            <a
              href={companyProfileDownloadUrl}
              download="MCS Company Profile.pdf"
              className={cn(
                "shadow-maritime hidden h-10 items-center gap-2 rounded-full border px-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 xl:inline-flex 2xl:px-5",
                isScrolled
                  ? "border-primary/25 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  : "border-maritime-navy/20 bg-background/80 text-maritime-navy hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              )}
            >
              <Download className="size-4" />
              Profile
            </a>
          )}

          <Link href="/contact">
            <Button
              className={cn(
                "shadow-maritime hidden cursor-pointer rounded-full px-5 font-bold transition-all duration-300 xl:flex 2xl:px-6",
                isScrolled
                  ? "bg-primary text-primary-foreground"
                  : "bg-maritime-navy text-white hover:bg-maritime-navy/90 dark:bg-primary dark:text-primary-foreground"
              )}
            >
              Contact Us
            </Button>
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "rounded-lg p-2 transition-colors xl:hidden",
              isScrolled
                ? "text-foreground"
                : "text-maritime-navy dark:text-white"
            )}
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] h-screen w-full transition-all duration-500 ease-in-out xl:hidden",
          "bg-background shadow-2xl dark:bg-[#020617]",
          mobileMenuOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-full opacity-0"
        )}
      >
        <div className="relative z-10 flex h-dvh flex-col overflow-y-auto px-5 py-5 sm:px-7">
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-border pb-4">
            <Link
              href="/"
              className="inline-flex min-w-0 items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BrandLogo
                lightSrc={logoUrl}
                darkSrc={darkLogoUrl}
                className="h-9 w-auto"
              />
              <span className="truncate text-xs font-bold tracking-wide text-foreground uppercase">
                {navbarBrandSubtext}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  className={cn(
                    "flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold tracking-normal transition-all duration-300 sm:text-lg",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted",
                    mobileMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  )}
                >
                  {link.name}
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </Link>
              )
            })}
          </div>

          <div
            className={cn(
              "mt-7 gap-2.5 space-y-3 border-t border-border pt-5 pb-5 transition-all delay-300 duration-500 sm:mt-auto",
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
          >
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="shadow-maritime-lg h-12 w-full rounded-xl text-sm font-bold">
                Contact Us
              </Button>
            </Link>
            {companyProfileDownloadUrl && (
              <a
                href={companyProfileDownloadUrl}
                download="MCS Company Profile.pdf"
                onClick={() => setMobileMenuOpen(false)}
                className="shadow-maritime-sm mt-2.5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-bold text-foreground hover:bg-muted"
              >
                <Download className="size-4" />
                Profile
              </a>
            )}
            <p className="text-center text-xs text-muted-foreground italic">
              {primaryEmail}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
