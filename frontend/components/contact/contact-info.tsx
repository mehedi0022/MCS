"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { GlobalPresence } from "./global-hubs"
import { useSiteSettings } from "@/context/site-settings-context"

export function ContactInfo() {
  const { settings } = useSiteSettings()

  const primaryEmail = settings?.contactEmails?.[0]?.trim() || "consult@maritime.com"
  const primaryPhone = settings?.contactPhones?.[0]?.trim() || "+1 (555) 000-MARI"
  const addressLine1 = settings?.officeAddressLine1?.trim() || "123 Harbour Way"
  const addressLine2 =
    settings?.officeAddressLine2?.trim() || "Maritime District, Suite 402"

  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      value: primaryEmail,
      sub: "Direct line to our lead engineering team.",
    },
    {
      icon: Phone,
      label: "Phone",
      value: primaryPhone,
      sub: "Mon-Fri from 9am to 6pm SGT.",
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
