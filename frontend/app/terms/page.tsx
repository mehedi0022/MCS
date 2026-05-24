import { Anchor } from "lucide-react"

export const metadata = {
  title: "Terms of Service | MCS",
  description:
    "Terms of Service for Marine Consultancy Services (MCS), including website use, limitations, and legal conditions.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
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
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Effective Date: May 24, 2026
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 pb-20">
        <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-7 leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <p>
            These Terms of Service govern your use of the Marine Consultancy
            Services (MCS) website. By accessing or using this website, you
            agree to these terms.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Use of Website
            </h2>
            <p className="mt-2">
              You agree to use this website only for lawful purposes. You must
              not use this site in any way that may damage, disrupt, or impair
              website functionality or security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              2. Informational Content
            </h2>
            <p className="mt-2">
              Website content is provided for general informational purposes.
              Project examples, service descriptions, and technical notes do not
              constitute a binding consultancy agreement unless formally agreed
              in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. Intellectual Property
            </h2>
            <p className="mt-2">
              All website content, including text, branding, graphics, and
              layout, is owned by or licensed to MCS unless otherwise stated.
              Unauthorized reproduction, distribution, or modification is
              prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. External Links
            </h2>
            <p className="mt-2">
              This website may include links to external websites. MCS is not
              responsible for the content, availability, or practices of
              third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Limitation of Liability
            </h2>
            <p className="mt-2">
              To the maximum extent permitted by law, MCS is not liable for any
              indirect, incidental, or consequential loss arising from use of
              this website or reliance on its content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. No Professional Engagement by Default
            </h2>
            <p className="mt-2">
              Submission of a contact form, inquiry, or communication through
              this website does not automatically create a client-consultant
              relationship. Engagement begins only through formal agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              7. User-Submitted Information
            </h2>
            <p className="mt-2">
              You are responsible for ensuring that information submitted via
              forms is accurate and lawful. You must not submit harmful,
              misleading, or unauthorized content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              8. Modifications
            </h2>
            <p className="mt-2">
              MCS may update or modify these Terms of Service at any time.
              Updated terms will be posted on this page with a revised
              effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              9. Governing Law
            </h2>
            <p className="mt-2">
              These terms are governed by the applicable laws of Bangladesh,
              without prejudice to mandatory legal protections available under
              relevant jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              10. Contact
            </h2>
            <p className="mt-2">
              For questions regarding these terms, please contact:
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
