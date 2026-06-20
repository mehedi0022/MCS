import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import {
  cleanupCloudinaryUploads,
  uploadToCloudinary,
} from "../services/cloudinary.service.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody } from "../utils/validate.js"
import {
  settingsSchema,
  type SiteSettingsInput,
} from "../validations/settings.validation.js"

type UploadedFiles = {
  logo?: Express.Multer.File[]
  darkLogo?: Express.Multer.File[]
  favicon?: Express.Multer.File[]
}

function readUploadedFiles(files: unknown): UploadedFiles {
  if (!files || typeof files !== "object") {
    return {}
  }
  return files as UploadedFiles
}

function parseJsonArray<T = string>(value: unknown): T[] | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined
  }
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? (parsed as T[]) : undefined
  } catch {
    return undefined
  }
}

export const getSettings: RequestHandler = async (_req, res, next) => {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      create: { id: "main" },
      update: {},
    })
    return sendSuccess(res, settings)
  } catch (error) {
    return next(error)
  }
}

export const updateSettings: RequestHandler = async (req, res, next) => {
  const uploadedPublicIds: string[] = []

  try {
    const existing = await prisma.siteSettings.upsert({
      where: { id: "main" },
      create: { id: "main" },
      update: {},
    })

    const body = req.body as Record<string, unknown>
    const files = readUploadedFiles(req.files)
    const logoFile = files.logo?.[0]
    const darkLogoFile = files.darkLogo?.[0]
    const faviconFile = files.favicon?.[0]

    const input = await validateBody<SiteSettingsInput>(settingsSchema, {
      officeAddressLine1: body.officeAddressLine1,
      officeAddressLine2: body.officeAddressLine2,
      mapLocation: body.mapLocation,
      mapLocationText: body.mapLocationText,
      contactEmails: parseJsonArray<string>(body.contactEmails),
      contactPhones: parseJsonArray<string>(body.contactPhones),
      branches: parseJsonArray<string>(body.branches),
      socialLinks: parseJsonArray<{ platform: string; url: string }>(
        body.socialLinks
      ),
      logoUrl: body.logoUrl,
      darkLogoUrl: body.darkLogoUrl,
      navbarBrandText: body.navbarBrandText,
      navbarBrandAccent: body.navbarBrandAccent,
      navbarBrandSubtext: body.navbarBrandSubtext,
      footerBrandText: body.footerBrandText,
      faviconUrl: body.faviconUrl,
    })

    let logoUrl = input.logoUrl ?? existing.logoUrl ?? undefined
    let logoPublicId = existing.logoPublicId ?? undefined
    let darkLogoUrl = input.darkLogoUrl ?? existing.darkLogoUrl ?? undefined
    let darkLogoPublicId = existing.darkLogoPublicId ?? undefined
    let faviconUrl = input.faviconUrl ?? existing.faviconUrl ?? undefined
    let faviconPublicId = existing.faviconPublicId ?? undefined

    if (logoFile) {
      const upload = await uploadToCloudinary(logoFile)
      logoUrl = upload.secure_url
      logoPublicId = upload.public_id
      uploadedPublicIds.push(upload.public_id)
    }

    if (darkLogoFile) {
      const upload = await uploadToCloudinary(darkLogoFile)
      darkLogoUrl = upload.secure_url
      darkLogoPublicId = upload.public_id
      uploadedPublicIds.push(upload.public_id)
    }

    if (faviconFile) {
      const upload = await uploadToCloudinary(faviconFile)
      faviconUrl = upload.secure_url
      faviconPublicId = upload.public_id
      uploadedPublicIds.push(upload.public_id)
    }

    const updated = await prisma.siteSettings.update({
      where: { id: "main" },
      data: {
        logoUrl,
        logoPublicId,
        darkLogoUrl,
        darkLogoPublicId,
        navbarBrandText: input.navbarBrandText,
        navbarBrandAccent: input.navbarBrandAccent,
        navbarBrandSubtext: input.navbarBrandSubtext,
        footerBrandText: input.footerBrandText,
        faviconUrl,
        faviconPublicId,
        officeAddressLine1: input.officeAddressLine1,
        officeAddressLine2: input.officeAddressLine2,
        mapLocation: input.mapLocation,
        mapLocationText: input.mapLocationText,
        contactEmails: input.contactEmails,
        contactPhones: input.contactPhones,
        branches: input.branches,
        socialLinks: input.socialLinks,
      },
    })

    const staleIds: string[] = []
    if (logoFile && existing.logoPublicId) staleIds.push(existing.logoPublicId)
    if (darkLogoFile && existing.darkLogoPublicId)
      staleIds.push(existing.darkLogoPublicId)
    if (faviconFile && existing.faviconPublicId)
      staleIds.push(existing.faviconPublicId)
    await cleanupCloudinaryUploads(staleIds)

    return sendSuccess(res, updated)
  } catch (error) {
    await cleanupCloudinaryUploads(uploadedPublicIds)
    return next(error)
  }
}
