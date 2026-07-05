import { Anchor } from "lucide-react"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"

const pageDescription =
  "Privacy Policy for Marine Consultancy Services (MCS), including data collection, usage, security, and contact information."

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: pageDescription,
  path: "/privacy",
})

const structuredData = createJsonLdGraph([
  createWebPageSchema({
    path: "/privacy",
    name: "Privacy Policy",
    description: pageDescription,
    type: "WebPage",
  }),
  createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ]),
])

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>
        <div className="relative z-10 container mx-auto max-w-5xl px-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:border-primary/30 dark:bg-primary/10">
            <Anchor className="h-3 w-3" />
            Legal
          </div>
          <h1 className="font-heading text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Effective Date: May 24, 2026
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 pb-20">
        <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-7 leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <p>
            Marine Consultancy Services (MCS) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            protect information when you visit our website or communicate with us.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We may collect information you provide directly, including:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Name</li>
              <li>Organization name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Subject and message details submitted through forms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">We use collected information to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Respond to inquiries and communication requests</li>
              <li>Provide technical and consultancy information</li>
              <li>Evaluate potential collaboration and project opportunities</li>
              <li>Improve our website content and service communication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. Cookies and Analytics
            </h2>
            <p className="mt-2">
              Our website may use basic cookies or similar technologies to
              improve user experience, maintain functionality, and understand
              website usage trends. You may control cookies through your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. Data Sharing
            </h2>
            <p className="mt-2">
              We do not sell your personal data. We may share limited
              information only when necessary with trusted service providers
              (such as website hosting or email services), or when required by
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Data Security
            </h2>
            <p className="mt-2">
              We apply reasonable technical and administrative measures to help
              protect information against unauthorized access, misuse, or
              disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. Data Retention
            </h2>
            <p className="mt-2">
              We retain personal information only as long as needed for
              communication, service-related purposes, legal obligations, or
              legitimate business operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              7. Your Rights
            </h2>
            <p className="mt-2">You may request to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access your personal information</li>
              <li>Correct inaccurate details</li>
              <li>Request deletion of your information, where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              8. Third-Party Links
            </h2>
            <p className="mt-2">
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those external
              sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              9. Updates to This Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              10. Contact
            </h2>
            <p className="mt-2">
              For privacy-related questions, please contact:
            </p>
            <p className="mt-2">
              Marine Consultancy Services (MCS)
              <br />
              Dhaka, Bangladesh
              <br />
              Email: info@mcs2024.com
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}
