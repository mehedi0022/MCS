"use client"

import { useEffect, useMemo, useRef, useState, type SVGProps } from "react"
import { ArrowUp } from "lucide-react"
import { useSiteSettings } from "@/context/site-settings-context"
import { cn } from "@/lib/utils"

const PROGRESS_RADIUS = 21
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

function normalizeWhatsappNumber(value?: string | null) {
  if (!value) {
    return ""
  }

  return value.replace(/[^\d]/g, "")
}

export function FloatingActions() {
  const { settings } = useSiteSettings()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const progressCircleRef = useRef<SVGCircleElement>(null)
  const whatsappNumber = useMemo(
    () => normalizeWhatsappNumber(settings?.whatsappNumber),
    [settings?.whatsappNumber]
  )

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      const clampedProgress = Math.min(Math.max(progress, 0), 1)

      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = String(
          PROGRESS_CIRCUMFERENCE - clampedProgress * PROGRESS_CIRCUMFERENCE
        )
      }

      setShowScrollTop(window.scrollY > 320)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 h-[108px] w-12 sm:right-6 sm:bottom-6">
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className={cn(
            "shadow-maritime-lg pointer-events-auto absolute right-0 bottom-0 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white transition-[transform,background-color,box-shadow] duration-300 ease-out hover:scale-105 hover:bg-[#1fb457] focus-visible:ring-2 focus-visible:ring-[#25D366]/40",
            showScrollTop
              ? "-translate-y-[60px] delay-75"
              : "translate-y-0 delay-150"
          )}
        >
          <WhatsappIcon className="size-6" />
        </a>
      )}

      <button
        type="button"
        aria-label="Scroll to top"
        title="Scroll to top"
        onClick={scrollToTop}
        className={cn(
          "shadow-maritime-lg pointer-events-auto absolute right-0 bottom-0 flex size-12 items-center justify-center rounded-full border border-border bg-background/90 text-primary backdrop-blur-xl transition-[transform,opacity,background-color,color,box-shadow] duration-300 ease-out hover:scale-105 hover:bg-primary hover:text-primary-foreground",
          showScrollTop
            ? "translate-y-0 opacity-100 delay-150"
            : "pointer-events-none translate-y-3 scale-90 opacity-0 delay-0"
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="absolute inset-0 size-full -rotate-90"
        >
          <circle
            cx="24"
            cy="24"
            r={PROGRESS_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-15"
          />
          <circle
            ref={progressCircleRef}
            cx="24"
            cy="24"
            r={PROGRESS_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={PROGRESS_CIRCUMFERENCE}
            strokeDashoffset={PROGRESS_CIRCUMFERENCE}
          />
        </svg>
        <ArrowUp className="relative size-5" />
      </button>
    </div>
  )
}

function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.06 0C5.49 0 .15 5.34.15 11.91c0 2.1.55 4.16 1.6 5.97L.05 24l6.27-1.65a11.9 11.9 0 0 0 5.74 1.46h.01c6.56 0 11.91-5.34 11.91-11.91 0-3.18-1.23-6.17-3.46-8.42Zm-8.45 18.32h-.01c-1.8 0-3.57-.48-5.11-1.39l-.37-.22-3.72.98.99-3.63-.24-.38a9.83 9.83 0 0 1-1.5-5.25c0-5.48 4.46-9.94 9.95-9.94a9.9 9.9 0 0 1 7.03 2.91 9.88 9.88 0 0 1 2.91 7.02c0 5.49-4.46 9.95-9.93 9.95Zm5.45-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}
