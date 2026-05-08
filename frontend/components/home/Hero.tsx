"use client"

import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade } from "swiper/modules"
import { ArrowRight, Sparkles } from "lucide-react"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

import slides from "@/data/hero-slides.json"

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-maritime-abyss">
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
        loop={true}
        className="h-full w-full [&_.swiper-pagination]:bottom-6 [&_.swiper-pagination-bullet]:bg-white/20 [&_.swiper-pagination-bullet-active]:bg-primary"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="relative flex h-full w-full items-center justify-center"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 scale-100 bg-cover bg-center transition-transform duration-[10000ms] ease-out [.swiper-slide-active_&]:scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Atmospheric Overlays */}
            <div className="absolute inset-0 bg-maritime-abyss/50 backdrop-blur-[1px] md:bg-maritime-abyss/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30 md:from-black/50 md:to-black/20" />

            {/* Content - Perfectly Centered with proper padding for pagination */}
            <div className="relative z-10 flex h-full w-full items-center justify-center pb-16 md:pb-20">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-center text-center">
                  {/* Premium badge */}
                  <div className="mb-3 inline-flex animate-in items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold tracking-[0.15em] text-maritime-foam backdrop-blur-md duration-1000 fade-in slide-in-from-top-4 sm:mb-4 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em] md:mb-6">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {slide.badgeText}
                  </div>

                  {/* Headline */}
                  <h1 className="animate-in px-4 font-heading text-2xl leading-tight font-bold tracking-tight text-white drop-shadow-2xl delay-200 duration-1000 fade-in slide-in-from-bottom-8 sm:px-0 sm:text-4xl md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="mx-auto mt-3 max-w-4xl animate-in px-4 text-sm leading-relaxed text-white/90 drop-shadow-lg delay-500 duration-1000 slide-in-from-bottom-10 fade-in sm:mt-4 sm:px-6 sm:text-base md:mt-6 md:text-lg lg:text-xl">
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="mt-6 flex w-full animate-in flex-col items-stretch justify-center gap-3 px-4 delay-700 duration-1000 fade-in slide-in-from-bottom-12 sm:mt-8 sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:px-0 md:mt-10">
                    {/* PRIMARY BUTTON */}
                    {slide.primaryButton && (
                      <Link
                        href={slide.primaryButton.link}
                        className="group shadow-maritime hover:shadow-maritime-lg inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-1 active:scale-95 sm:h-13 sm:px-10 sm:text-base md:h-14"
                      >
                        {slide.primaryButton.text}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                      </Link>
                    )}

                    {/* SECONDARY BUTTON */}
                    {slide.secondaryButton && (
                      <Link
                        href={slide.secondaryButton.link}
                        className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/60 hover:bg-white/20 active:scale-95 sm:h-13 sm:px-10 sm:text-base md:h-14"
                      >
                        {slide.secondaryButton.text}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom gradient fade - reduced height */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-maritime-abyss/60 to-transparent md:h-24" />
    </section>
  )
}
