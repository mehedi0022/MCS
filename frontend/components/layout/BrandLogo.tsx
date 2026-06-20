import Image from "next/image"
import { cn } from "@/lib/utils"

const DEFAULT_LIGHT_LOGO = "/mcs_logo.png"
const DEFAULT_DARK_LOGO = "/mcs_logo_dark.png"

type BrandLogoProps = {
  lightSrc?: string | null
  darkSrc?: string | null
  className?: string
  imageClassName?: string
  priority?: boolean
}

function getLogoSource(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback
}

export function BrandLogo({
  lightSrc,
  darkSrc,
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  const lightLogo = getLogoSource(lightSrc, DEFAULT_LIGHT_LOGO)
  const darkLogo = getLogoSource(darkSrc, DEFAULT_DARK_LOGO)

  return (
    <span
      className={cn(
        "relative inline-flex h-10 w-28 shrink-0 items-start justify-start sm:h-11 sm:w-32",
        className
      )}
    >
      <Image
        src={lightLogo}
        alt="Marine Consultancy Services"
        width={180}
        height={72}
        sizes="(max-width: 640px) 112px, 144px"
        priority={priority}
        className={cn(
          "h-full w-full object-contain object-left dark:hidden",
          imageClassName
        )}
      />
      <Image
        src={darkLogo}
        alt="Marine Consultancy Services"
        width={180}
        height={72}
        sizes="(max-width: 640px) 112px, 144px"
        priority={priority}
        className={cn(
          "hidden h-full w-full object-contain object-left dark:block",
          imageClassName
        )}
      />
    </span>
  )
}
