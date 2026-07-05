/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og"
import { absoluteUrl, siteConfig, truncateText } from "@/lib/seo"
import { getProjectBySlug } from "@/lib/projects"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

type ImageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectOpenGraphImage({ params }: ImageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  const title = project?.title ?? "MCS Project Case Study"
  const description =
    project?.summary ||
    project?.description ||
    "Marine consultancy, hydrographic survey, GIS mapping, and waterway development project support."
  const cover = absoluteUrl(project?.cover || siteConfig.defaultOgImage)
  const category = project?.category ?? "Project"
  const location = project?.location ?? "Bangladesh"

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#07111f",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <img
          src={cover}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(3, 10, 22, 0.92) 0%, rgba(3, 10, 22, 0.74) 42%, rgba(3, 10, 22, 0.22) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, rgba(3, 10, 22, 0.62) 0%, rgba(3, 10, 22, 0) 55%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "54px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 68,
                height: 68,
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.92)",
                color: "#0f766e",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              MCS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 0,
                }}
              >
                {siteConfig.name}
              </div>
              <div
                style={{
                  color: "#a7f3d0",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {category} / {location}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "fit-content",
                borderRadius: 999,
                border: "1px solid rgba(167, 243, 208, 0.46)",
                background: "rgba(15, 118, 110, 0.28)",
                padding: "10px 18px",
                color: "#d1fae5",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Project Case Study
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: 0,
              }}
            >
              {truncateText(title, 92)}
            </div>
            <div
              style={{
                maxWidth: 720,
                color: "#dbeafe",
                fontSize: 25,
                lineHeight: 1.35,
                fontWeight: 600,
              }}
            >
              {truncateText(description, 150)}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  )
}
