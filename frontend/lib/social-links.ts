import type { SocialLink } from "@/context/site-settings-context"

export const SOCIAL_PLATFORMS = [
  {
    platform: "LinkedIn",
    placeholder: "https://www.linkedin.com/company/...",
  },
  {
    platform: "Instagram",
    placeholder: "https://www.instagram.com/...",
  },
  {
    platform: "Facebook",
    placeholder: "https://www.facebook.com/...",
  },
  {
    platform: "YouTube",
    placeholder: "https://www.youtube.com/@...",
  },
] as const

function normalizePlatform(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function toFixedSocialLinks(
  links: SocialLink[] | null | undefined
): SocialLink[] {
  return SOCIAL_PLATFORMS.map(({ platform }) => {
    const stored = links?.find(
      (item) => normalizePlatform(item.platform) === normalizePlatform(platform)
    )

    return {
      platform,
      url: stored?.url?.trim() ?? "",
    }
  })
}

export function getVisibleSocialLinks(
  links: SocialLink[] | null | undefined
): SocialLink[] {
  return toFixedSocialLinks(links).filter((item) => item.url.trim())
}
