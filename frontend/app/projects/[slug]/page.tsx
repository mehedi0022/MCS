import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/seo/JsonLd"
import { Breadcrumbs } from "@/components/seo/Breadcrumbs"
import {
  absoluteUrl,
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
  siteConfig,
} from "@/lib/seo"
import { getProjectBySlug } from "@/lib/projects"

import { ProjectHeader } from "@/components/projects/details/project-header"
import { ProjectContent } from "@/components/projects/details/project-content"
import { ProjectMeta } from "@/components/projects/details/project-meta"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  const path = `/projects/${project?.slug ?? slug}`

  if (!project) {
    return createPageMetadata({
      title: "Project Not Found",
      description: "The requested MCS project case study could not be found.",
      path,
      noIndex: true,
    })
  }

  const description = project.summary || project.description
  const keywords = [
    project.category,
    project.location,
    project.client,
    "MCS project",
    "marine consultancy case study",
  ].filter((item): item is string => Boolean(item))

  return createPageMetadata({
    title: project.title,
    description,
    path,
    image: `${path}/opengraph-image`,
    imageAlt: `${project.title} - MCS project preview`,
    keywords,
    openGraphType: "article",
    publishedTime: project.createdAt,
    modifiedTime: project.updatedAt,
  })
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const description = project.description || project.summary
  const summary = project.summary || project.description
  const date = project.createdAt ?? null
  const path = `/projects/${project.slug}`
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: project.title, href: path },
  ]
  const structuredData = createJsonLdGraph([
    createWebPageSchema({
      path,
      name: project.title,
      description: summary,
      type: "WebPage",
    }),
    createBreadcrumbSchema(
      breadcrumbItems.map((item) => ({ name: item.name, path: item.href }))
    ),
    {
      "@type": "CreativeWork",
      "@id": `${absoluteUrl(path)}#project`,
      url: absoluteUrl(path),
      name: project.title,
      headline: project.title,
      description: summary,
      image: absoluteUrl(project.cover),
      about: project.category,
      creator: {
        "@id": absoluteUrl("#organization"),
      },
      publisher: {
        "@id": absoluteUrl("#organization"),
      },
      provider: {
        "@id": absoluteUrl("#organization"),
      },
      isPartOf: {
        "@id": absoluteUrl("#website"),
      },
      locationCreated: project.location,
      dateCreated: project.year ? `${project.year}-01-01` : undefined,
      copyrightHolder: siteConfig.name,
      inLanguage: siteConfig.language,
    },
  ])

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      <main className="container mx-auto max-w-4xl px-6 pt-32 pb-24">
        <div className="space-y-10">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="space-y-16">
            <ProjectHeader
              title={project.title}
              summary={summary}
            />

            <ProjectMeta
              year={project.year}
              date={date}
              location={project.location}
              category={project.category}
              client={project.client}
            />

            <ProjectContent
              cover={project.cover}
              title={project.title}
              description={description}
              gallery={project.gallery}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
