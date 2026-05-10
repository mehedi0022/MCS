"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function ProjectContent({
  cover,
  description,
  gallery,
}: {
  cover: string
  description: string
  gallery: string[]
}) {
  return (
    <div className="space-y-10">
      {/* Cover Image */}
      <div className="relative aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 shadow-2xl dark:border-white/10 dark:bg-white/5">
        <Image
          src={cover}
          alt="Project cover image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Description below cover */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
        <h3 className="mb-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Project Description
        </h3>
        <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>

      {/* Gallery Slider */}
      {gallery.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Gallery
          </h3>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            className="[&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white [&_.swiper-pagination-bullet-active]:bg-primary"
          >
            {gallery.map((img, index) => (
              <SwiperSlide key={img + index}>
                <div className="group relative aspect-video overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10">
                  <Image
                    src={img}
                    alt={`Project gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}
