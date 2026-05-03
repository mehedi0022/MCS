"use client"

import React from "react"
import { MapPin } from "lucide-react"

export function ContactMap() {
  // Replace this with your actual location coordinates or address
  const mapLocation = "123+Harbour+Way,+Maritime+District,+Singapore"
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mapLocation}`

  return (
    <section className="mt-20">
      <div className="group shadow-maritime-lg hover:shadow-maritime-xl relative overflow-hidden rounded-[2.5rem] border border-border/30 bg-card transition-all">
        {/* Floating Location Badge */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-background/80 px-4 py-2 backdrop-blur-xl dark:bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <MapPin className="h-4 w-4 text-primary dark:text-maritime-teal" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Global Headquarters — Singapore
          </span>
        </div>

        {/* The Map Embed */}
        <div className="relative aspect-[21/9] min-h-[400px] w-full">
          <iframe
            title="Maritime Solutions Headquarters"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.81991!2d103.8475!3d1.2761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da190d6!2sMarina+Bay+Financial+Centre!5e0!3m2!1sen!2ssg!4v1700000000000!5m2!1sen!2ssg"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="contrast-125 grayscale transition-all duration-700 hover:grayscale-0 dark:contrast-[1.1] dark:hue-rotate-[180deg] dark:invert-[90%]"
          />
        </div>

        {/* Premium Bottom Glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      </div>
    </section>
  )
}
