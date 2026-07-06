"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

function sanitizeRichHtml(input: string) {
  if (!input.trim()) return ""
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return input
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<(iframe|object|embed)[\s\S]*?>[\s\S]*?<\/\1>/gi, "")
      .replace(/\son\w+=(["']).*?\1/gi, "")
      .replace(/\s(href|src)=(["'])javascript:[\s\S]*?\2/gi, "")
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(input, "text/html")

  doc.querySelectorAll("script,style,iframe,object,embed").forEach((node) => {
    node.remove()
  })

  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const key = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (key.startsWith("on")) {
        el.removeAttribute(attr.name)
      }
      if (
        (key === "href" || key === "src") &&
        value.startsWith("javascript:")
      ) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return doc.body.innerHTML
}

export function ProjectContent({
  cover,
  title,
  description,
  gallery,
}: {
  cover: string
  title: string
  description: string
  gallery: string[]
}) {
  const safeHtml = sanitizeRichHtml(description)
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(description)

  return (
    <div className="space-y-10">
      {/* Cover Image */}
      <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl dark:border-white/10 dark:bg-white/5">
        <Image
          src={cover}
          alt={`${title} project cover image`}
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
          priority
        />
      </div>

      {/* Description below cover */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
        <h3 className="mb-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Project Description
        </h3>
        {hasHtml ? (
          <div
            className="space-y-3 leading-relaxed text-slate-600 dark:text-slate-300 [&_a]:text-primary [&_a]:underline [&_h3]:text-lg [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        ) : (
          <p className="leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>

      {/* Gallery Slider */}
      {gallery.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Gallery
          </h3>
          <Swiper
            modules={[Pagination]}
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
                <div className="group relative aspect-video overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                  <Image
                    src={img}
                    alt={`${title} gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
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
