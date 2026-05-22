"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Anchor, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSiteSettings } from "@/context/site-settings-context"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about-us" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { settings } = useSiteSettings()
  const logoUrl = settings?.logoUrl?.trim()
  const primaryEmail = settings?.contactEmails?.[0]?.trim() || "consult@maritime.com"

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

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
        <Link href="/" className="group flex items-center gap-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company logo"
              className="h-9 w-auto object-contain"
            />
          ) : (
            <div className="rounded-lg bg-primary p-1.5 transition-all duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Anchor className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                "text-base font-bold tracking-tighter uppercase transition-colors duration-300 md:text-lg",
                isScrolled
                  ? "text-foreground"
                  : "text-maritime-navy dark:text-white"
              )}
            >
              Maritime <span className="font-light">Consulting</span>
            </span>
            <span
              className={cn(
                "text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-300",
                isScrolled
                  ? "text-muted-foreground"
                  : "text-maritime-navy/70 dark:text-white/70"
              )}
            >
              Solutions & Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
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
        <div className="flex items-center gap-4">
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

          <Link href="/contact">
            <Button
              className={cn(
                "shadow-maritime hidden rounded-full px-6 font-bold transition-all duration-300 md:flex",
                isScrolled
                  ? "bg-primary text-primary-foreground"
                  : "bg-maritime-navy text-white hover:bg-maritime-navy/90 dark:bg-primary dark:text-primary-foreground"
              )}
            >
              GET CONSULTATION
            </Button>
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "p-2 transition-colors md:hidden",
              isScrolled
                ? "text-foreground"
                : "text-maritime-navy dark:text-white"
            )}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 h-screen w-full transition-all duration-500 ease-in-out md:hidden",
          "bg-background/98 backdrop-blur-md", // More opaque for readability
          mobileMenuOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-full opacity-0"
        )}
      >
        <div className="relative z-10 flex h-full flex-col p-8 pt-24">
          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  className={cn(
                    "flex items-center justify-between border-b border-border/50 pb-5 text-2xl font-bold tracking-tight transition-all duration-300",
                    isActive
                      ? "translate-x-2 text-primary"
                      : "text-foreground hover:translate-x-2",
                    mobileMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  )}
                >
                  {link.name}
                  <ChevronRight
                    className={cn(
                      "h-6 w-6 transition-transform",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </Link>
              )
            })}
          </div>

          <div
            className={cn(
              "mt-auto space-y-6 transition-all delay-300 duration-500",
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
          >
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="shadow-maritime-lg h-14 w-full rounded-2xl text-lg font-bold">
                GET CONSULTATION
              </Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground italic">
              {primaryEmail}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
