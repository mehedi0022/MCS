"use client"

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
    <section className="min-h-70vh relative w-full overflow-hidden bg-background">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2500}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full [&_.swiper-pagination]:bottom-12 [&_.swiper-pagination-bullet]:bg-foreground/20 [&_.swiper-pagination-bullet-active]:bg-primary"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="relative flex h-full w-full items-start justify-center"
          >
            {/* Background Image - Smoother scaling transition */}
            <div
              className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-1200 ease-out group-[.swiper-slide-active]:scale-100"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            <div className="bg-blue-400-100/40 absolute inset-0 backdrop-blur transition-colors duration-700 dark:bg-maritime-abyss/85" />

            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/10 dark:to-maritime-abyss/40" />

            <div className="relative z-10 container mx-auto px-6 pt-40 pb-30 md:pt-48 md:pb-40">
              <div className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
                {/* Premium badge */}
                <div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-primary/10 bg-white/40 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary backdrop-blur-md duration-1000 fade-in slide-in-from-top-4 dark:border-white/10 dark:bg-white/5 dark:text-maritime-foam">
                  <Sparkles className="h-3.5 w-3.5" />
                  LEADING THE HORIZON
                </div>

                {/* Main Headline - Using your OKLCH primary for a touch of color in light mode */}
                <h1 className="animate-in font-heading text-5xl font-bold tracking-tight text-foreground delay-200 duration-1000 fade-in slide-in-from-bottom-8 sm:text-7xl lg:text-8xl dark:text-white">
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
                <p className="mx-auto mt-8 max-w-2xl animate-in text-lg leading-relaxed text-muted-foreground/90 delay-500 duration-1000 slide-in-from-bottom-10 fade-in sm:text-xl md:text-2xl dark:text-maritime-horizon/90">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="my-12 flex animate-in flex-col items-center justify-center gap-5 delay-700 duration-1000 fade-in slide-in-from-bottom-12 sm:flex-row">
                  <Link
                    href="/services"
                    className="group shadow-maritime-lg hover:shadow-maritime-xl inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-bold text-primary-foreground transition-all hover:-translate-y-1 active:scale-95"
                  >
                    Our Services
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-14 items-center justify-center rounded-full border border-border bg-white/20 px-10 text-base font-bold text-foreground backdrop-blur-xl transition-all hover:bg-white/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Get Consultation
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
