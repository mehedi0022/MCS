"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import { ArrowRight, Sparkles } from "lucide-react"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

import fallbackSlides from "@/data/hero-slides.json"
import { api, type ApiResponse } from "@/lib/api"

type HeroSlide = {
  id: string | number
  badgeText: string
  title: string
  subtitle: string
  imageUrl?: string
  image?: string
  primaryButtonText?: string | null
  primaryButtonLink?: string | null
  secondaryButtonText?: string | null
  secondaryButtonLink?: string | null
  primaryButton?: {
    text: string
    link: string
  }
  secondaryButton?: {
    text: string
    link: string
  }
}

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides)

  useEffect(() => {
    async function loadHeroSlides() {
      try {
        const response = await api.get<ApiResponse<HeroSlide[]>>("/hero-slides")

        if (response.data.data.length > 0) {
          setSlides(response.data.data)
        }
      } catch {
        setSlides(fallbackSlides)
      }
    }

    loadHeroSlides()
  }, [])

  return (
    <section className="relative h-[520px] w-full overflow-hidden bg-maritime-abyss sm:h-[560px] md:h-[620px] lg:h-[660px] xl:h-[680px]">
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 z-30 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2200}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full [&_.swiper-pagination]:bottom-5 md:[&_.swiper-pagination]:bottom-7 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-6 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/30 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-primary"
      >
        {slides.map((slide) => {
          const primaryButton =
            slide.primaryButton ??
            (slide.primaryButtonText && slide.primaryButtonLink
              ? { text: slide.primaryButtonText, link: slide.primaryButtonLink }
              : null)
          const secondaryButton =
            slide.secondaryButton ??
            (slide.secondaryButtonText && slide.secondaryButtonLink
              ? {
                  text: slide.secondaryButtonText,
                  link: slide.secondaryButtonLink,
                }
              : null)

          return (
            <SwiperSlide
              key={slide.id}
              className="relative flex h-full w-full items-center justify-center"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 scale-100 bg-cover bg-center transition-transform duration-[10000ms] ease-out [.swiper-slide-active_&]:scale-105"
                style={{
                  backgroundImage: `url(${slide.imageUrl ?? slide.image})`,
                }}
              />

              {/* Atmospheric Overlays */}
              <div className="absolute inset-0 bg-maritime-abyss/45 backdrop-blur-[0.5px] md:bg-maritime-abyss/35" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/45 md:bg-gradient-to-r md:from-black/70 md:via-black/35 md:to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex h-full w-full items-center pt-24 pb-12 sm:pt-28 sm:pb-14 md:pb-16">
                <div className="container mx-auto px-5 sm:px-6">
                  <div className="flex max-w-4xl flex-col items-center text-center md:items-start md:text-left">
                    {/* Premium badge */}
                    <div className="mb-3 inline-flex animate-in items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-bold tracking-[0.15em] text-maritime-foam backdrop-blur-md duration-1000 fade-in slide-in-from-top-4 sm:mb-4 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em] md:mb-5">
                      <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {slide.badgeText}
                    </div>

                    {/* Headline */}
                    <h1 className="max-w-4xl animate-in font-heading text-[1.9rem] leading-[1.08] font-bold tracking-tight text-white drop-shadow-2xl delay-200 duration-1000 fade-in slide-in-from-bottom-8 sm:text-4xl md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-3 max-w-3xl animate-in text-sm leading-relaxed text-white/90 drop-shadow-lg delay-500 duration-1000 slide-in-from-bottom-10 fade-in sm:mt-4 sm:text-base md:mt-5 md:text-lg">
                      {slide.subtitle}
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-5 flex w-full animate-in flex-col items-stretch justify-center gap-3 delay-700 duration-1000 fade-in slide-in-from-bottom-12 sm:mt-7 sm:w-auto sm:flex-row sm:items-center sm:justify-start sm:gap-4 md:mt-8">
                      {/* PRIMARY BUTTON */}
                      {primaryButton && (
                        <Link
                          href={primaryButton.link}
                          className="group shadow-maritime hover:shadow-maritime-lg inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-1 active:scale-95 sm:h-12 sm:px-9 sm:text-base md:h-13"
                        >
                          {primaryButton.text}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                        </Link>
                      )}

                      {/* SECONDARY BUTTON */}
                      {secondaryButton && (
                        <Link
                          href={secondaryButton.link}
                          className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/60 hover:bg-white/20 active:scale-95 sm:h-12 sm:px-9 sm:text-base md:h-13"
                        >
                          {secondaryButton.text}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Bottom gradient fade - reduced height */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-maritime-abyss/60 to-transparent md:h-14" />
    </section>
  )
}
