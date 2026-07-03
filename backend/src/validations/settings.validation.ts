import * as yup from "yup"

export type SocialLinkInput = {
  platform: string
  url: string
}

export type SiteSettingsInput = {
  officeAddressLine1?: string
  officeAddressLine2?: string
  mapLocation?: string
  mapLocationText?: string
  whatsappNumber?: string
  companyProfileUrl?: string
  contactEmails?: string[]
  contactPhones?: string[]
  branches?: string[]
  socialLinks?: SocialLinkInput[]
  logoUrl?: string
  darkLogoUrl?: string
  navbarBrandText?: string
  navbarBrandAccent?: string
  navbarBrandSubtext?: string
  footerBrandText?: string
  faviconUrl?: string
}

export const settingsSchema = yup.object({
  officeAddressLine1: yup.string().optional(),
  officeAddressLine2: yup.string().optional(),
  mapLocation: yup.string().optional(),
  mapLocationText: yup.string().optional(),
  whatsappNumber: yup.string().optional(),
  companyProfileUrl: yup.string().optional(),
  contactEmails: yup.array().of(yup.string().email().required()).optional(),
  contactPhones: yup.array().of(yup.string().required()).optional(),
  branches: yup.array().of(yup.string().required()).optional(),
  socialLinks: yup
    .array()
    .of(
      yup.object({
        platform: yup.string().required(),
        url: yup.string().url().required(),
      })
    )
    .optional(),
  logoUrl: yup.string().optional(),
  darkLogoUrl: yup.string().optional(),
  navbarBrandText: yup.string().optional(),
  navbarBrandAccent: yup.string().optional(),
  navbarBrandSubtext: yup.string().optional(),
  footerBrandText: yup.string().optional(),
  faviconUrl: yup.string().optional(),
})
