"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { GlobalPresence } from "./global-hubs"
import { useSiteSettings } from "@/context/site-settings-context"

export function ContactInfo() {
  const { settings } = useSiteSettings()

  const primaryEmail = settings?.contactEmails?.[0]?.trim() || "info@mcs2024.com"
  const primaryPhone = settings?.contactPhones?.[0]?.trim() || "+880 1XXX-XXXXXX"
  const addressLine1 = settings?.officeAddressLine1?.trim() || "Dhaka"
  const addressLine2 = settings?.officeAddressLine2?.trim() || "Bangladesh"

  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      value: primaryEmail,
      sub: "Quick response from our technical team.",
    },
    {
      icon: Phone,
      label: "Phone",
      value: primaryPhone,
      sub: "Mon-Sat from 9am to 6pm (BST).",
    },
    {
      icon: MapPin,
      label: "Office",
      value: addressLine1,
      sub: addressLine2,
    },
  ]

  return (
    <div className="space-y-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
        {infoItems.map((item, i) => (
          <div key={i} className="group flex gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-md dark:border-white/10 dark:bg-[#020617]/80">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider text-foreground uppercase">
                {item.label}
              </h4>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {item.value}
              </p>
              <p className="text-sm text-muted-foreground">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <GlobalPresence />
    </div>
  )
}
