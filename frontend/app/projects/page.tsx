import { ProjectGallery } from "@/components/projects/project-gallery"
import { Anchor } from "lucide-react"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  absoluteUrl,
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"
import { getAllProjects } from "@/lib/projects"

const pageDescription =
  "Explore hydrographic, environmental, and consultancy assignments across Bangladesh's coastal and inland water sectors."

export const metadata = createPageMetadata({
  title: "Our Projects & Experience",
  description: pageDescription,
  path: "/projects",
  keywords: [
    "MCS projects",
    "hydrographic case studies",
    "marine consultancy projects",
  ],
})

export default async function ProjectPage() {
  const projects = await getAllProjects()
  const structuredData = createJsonLdGraph([
    createWebPageSchema({
      path: "/projects",
      name: "Our Projects & Experience",
      description: pageDescription,
      type: "CollectionPage",
    }),
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/projects")}#project-list`,
      name: "MCS project case studies",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/projects/${project.slug}`),
        name: project.title,
      })),
    },
  ])

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      {/* Hero Header - Static Content */}

      <section className="relative overflow-hidden pt-26 pb-10 md:pt-32 md:pb-15">
        {/* Background patterns */}
        <div className="absolute inset-0 z-0">
          {/* Radial Gradient - Better visibility in both modes */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />

          {/* Grid Pattern - Optimized for Light & Dark */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[8px] font-bold tracking-[0.2em] text-primary uppercase md:text-[10px] dark:border-primary/30 dark:bg-primary/10">
              <Anchor className="h-3 w-3" />
              Our Projects & Experience
            </div>

            <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
              Delivering Data-Driven{" "}
              <span className="text-primary">Solutions</span>
            </h1>

            <p className="mt-8 text-base leading-relaxed text-slate-500 md:text-xl dark:text-slate-400">
              MCS has contributed to a range of hydrographic, environmental, and
              consultancy assignments across Bangladesh&apos;s coastal and
              inland water sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Client Component for Filtering and Grid */}
      <ProjectGallery initialProjects={projects} />
    </main>
  )
}
