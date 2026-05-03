"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Anchor, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

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

  // Handle Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // BLOCK SCROLLING when mobile menu is open
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
        isScrolled ? "glass-nav py-3" : "bg-transparent py-6"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1.5 transition-transform group-hover:rotate-12">
            <Anchor className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                "text-lg font-bold tracking-tighter transition-colors duration-300",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              MARITIME <span className="font-light"> CONSULTING</span>
            </span>
            <span
              className={cn(
                "text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-300",
                isScrolled ? "text-muted-foreground" : "text-white/70"
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
                  "relative text-sm font-bold tracking-wide transition-all duration-300",
                  isScrolled
                    ? isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                    : isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full transition-colors",
                      isScrolled ? "bg-primary" : "bg-white"
                    )}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "rounded-full border transition-colors duration-300 focus:ring-2 focus:ring-primary/50 focus:outline-none",
              isScrolled ? "text-foreground" : "text-white"
            )}
          >
            <ThemeToggle />
          </div>

          <Button
            className={cn(
              "hidden rounded-full px-6 font-bold transition-all duration-300 md:flex",
              isScrolled
                ? "shadow-maritime bg-primary text-primary-foreground"
                : "border-none bg-white text-primary hover:bg-white/90"
            )}
          >
            GET CONSULTATION
          </Button>

          {/* Mobile Toggle - Improved Hitbox */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "rounded-full p-2 transition-colors focus:ring-2 focus:ring-primary/50 focus:outline-none md:hidden",
              isScrolled ? "text-foreground" : "text-white"
            )}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Fixed Transparency & Added Scroll Lock */}
      <div
        className={cn(
          "fixed inset-0 z-40 h-screen w-full bg-background transition-all duration-500 ease-in-out md:hidden dark:bg-maritime-abyss",
          mobileMenuOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-full opacity-0"
        )}
      >
        {/* Decorative Grid Overlay for premium feel */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:24px_24px] opacity-20" />

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
                    "flex items-center justify-between border-b border-border/40 pb-5 text-2xl font-bold tracking-tight transition-all duration-300",
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
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Ready to chart a new course?
              </p>
              <Button className="shadow-maritime-lg h-16 w-full rounded-2xl text-lg font-bold">
                GET CONSULTATION
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground italic">
              Consult@Maritime-Solutions.com
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
