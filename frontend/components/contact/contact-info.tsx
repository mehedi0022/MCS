import { Mail, Phone, MapPin, Clock, Anchor } from "lucide-react"
import { GlobalPresence } from "./global-hubs"

const infoItems = [
  {
    icon: Mail,
    label: "Email",
    value: "consult@maritime-solutions.com",
    sub: "Direct line to our lead engineering team.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 000-MARI",
    sub: "Mon-Fri from 9am to 6pm SGT.",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "123 Harbour Way, Singapore",
    sub: "Maritime District, Suite 402.",
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
        {infoItems.map((item, i) => (
          <div key={i} className="group flex gap-5">
            <div className="shadow-maritime-sm group-hover:shadow-maritime flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-background transition-all group-hover:border-primary/30 dark:border-white/10 dark:bg-white/5">
              <item.icon className="h-5 w-5 text-primary dark:text-maritime-teal" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider text-foreground uppercase">
                {item.label}
              </h4>
              <p className="mt-1 text-lg font-medium text-maritime-navy dark:text-maritime-horizon">
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
