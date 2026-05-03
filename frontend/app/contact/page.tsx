import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { ContactMap } from "@/components/contact/contact-map"

export default function ContactPage() {
  return (
    <main className="bg-maritime-surface texture-maritime-noise relative min-h-screen pt-32 pb-24 dark:bg-background dark:bg-none">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 rounded-full bg-primary/5 blur-[120px] dark:bg-maritime-ocean/10" />

      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-sm font-bold tracking-[0.3em] text-primary uppercase dark:text-maritime-teal">
            Connect With Us
          </h1>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl dark:text-white">
            Navigating your{" "}
            <span className="text-maritime-gradient dark:text-maritime-light-gradient">
              objectives.
            </span>
          </h2>
        </div>

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
