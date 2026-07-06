import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { ContactMap } from "@/components/contact/contact-map"
import { Anchor } from "lucide-react"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"

const pageDescription =
  "Contact Marine Consultancy Services (MCS) for hydrographic surveys, GIS mapping, environmental studies, dredging support, training, and project consultancy."

export const metadata = createPageMetadata({
  title: "Contact Marine Consultancy Services",
  description: pageDescription,
  path: "/contact",
  keywords: [
    "contact MCS",
    "marine consultancy contact",
    "hydrographic survey inquiry",
  ],
})

const structuredData = createJsonLdGraph([
  createWebPageSchema({
    path: "/contact",
    name: "Contact Marine Consultancy Services",
    description: pageDescription,
    type: "ContactPage",
  }),
  createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]),
])

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-slate-50 pb-24 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />
      <section className="relative overflow-hidden pt-26 pb-10 md:pt-32 md:pb-15">
        {/* Background patterns */}
        <div className="absolute inset-0 z-0">
          {/* Radial Gradient - Better visibility in both modes */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />

          {/* Grid Pattern - Optimized for Light & Dark */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[8px] font-bold tracking-[0.2em] text-primary uppercase md:text-[10px] dark:border-primary/30 dark:bg-primary/10">
              <Anchor className="h-3 w-3" />
              Contact Us
            </div>

            <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
              Let&apos;s Discuss Your{" "}
              <span className="text-primary">Project.</span>
            </h1>

            <p className="mt-8 text-base leading-relaxed text-slate-500 md:text-xl dark:text-slate-400">
              Whether you are planning a project, seeking technical expertise,
              or exploring collaboration opportunities, our team is ready to
              assist.
            </p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-6 pt-10">
        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ContactInfo />
          <ContactForm />
        </div>

        {/* Embed Map at the bottom */}
        <ContactMap />
      </div>
    </main>
  )
}
