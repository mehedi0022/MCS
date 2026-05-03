"use client"

import React from "react"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import { ArrowRight, Sparkles } from "lucide-react"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

const slides = [
  {
    image: "/hero1.png",
    title: "Engineering Excellence in Maritime Solutions",
    subtitle:
      "Delivering innovative consultancy services for ports, offshore, and coastal infrastructure worldwide.",
  },
  {
    image: "/hero2.png",
    title: "Next-Generation Fleet Infrastructure",
    subtitle:
      "Pioneering the integration of autonomous systems and predictive analytics for modern maritime ops.",
  },
]

export function Hero() {
  return (
    <section className="relative h-screen min-h-187.5 w-full overflow-hidden bg-maritime-abyss">
      {/* 1. TOP PADDING FIX: High-z-index highlight to blend with Navbar */}
      <div className="absolute inset-x-0 top-0 z-30 h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2200}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full [&_.swiper-pagination]:bottom-12 [&_.swiper-pagination-bullet]:bg-white/20 [&_.swiper-pagination-bullet-active]:bg-primary"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="relative flex h-full w-full items-start justify-center"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 scale-100 bg-cover bg-center transition-transform duration-10000 ease-out group-[.swiper-slide-active]:scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Atmospheric Overlays */}
            <div className="absolute inset-0 bg-maritime-abyss/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/20" />

            {/* 2. CONTENT PADDING: Changed pt-20 to pt-56 to clear your Navbar completely */}
            <div className="relative z-10 container mx-auto px-6 pt-56 md:pt-64">
              <div className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
                {/* Premium badge */}
                <div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-maritime-foam backdrop-blur-md duration-1000 fade-in slide-in-from-top-4">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  LEADING THE HORIZON
                </div>

                {/* Headline with drop-shadow for clarity */}
                <h1 className="animate-in font-heading text-5xl font-bold tracking-tight text-white drop-shadow-2xl delay-200 duration-1000 fade-in slide-in-from-bottom-8 sm:text-7xl lg:text-8xl">
                  {slide.title.split(" ").map((word, i) =>
                    word === "Maritime" || word === "Engineering" ? (
                      <span
                        key={i}
                        className="text-primary dark:text-maritime-teal"
                      >
                        {word}{" "}
                      </span>
                    ) : (
                      word + " "
                    )
                  )}
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mt-8 max-w-2xl animate-in text-lg leading-relaxed text-white/90 drop-shadow-lg delay-500 duration-1000 slide-in-from-bottom-10 fade-in sm:text-xl md:text-2xl">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="mt-12 flex animate-in flex-col items-center justify-center gap-5 delay-700 duration-1000 fade-in slide-in-from-bottom-12 sm:flex-row">
                  <Link
                    href="/services"
                    className="group shadow-maritime-lg hover:shadow-maritime-xl inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-bold text-primary-foreground transition-all hover:-translate-y-1 active:scale-95"
                  >
                    Our Services
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/10 px-10 text-base font-bold text-white backdrop-blur-xl transition-all hover:bg-white/20"
                  >
                    Get Consultation
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 3. BOTTOM EFFECT FIX: Removed the sharp dark bar and replaced with a subtle, ultra-soft fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-linear-to-t from-maritime-abyss/80 to-transparent" />
    </section>
  )
}
