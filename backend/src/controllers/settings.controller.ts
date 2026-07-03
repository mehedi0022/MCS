import type { RequestHandler } from "express"
import { cloudinary } from "../config/cloudinary.js"
import { prisma } from "../lib/prisma.js"
import {
  cleanupCloudinaryUploads,
  uploadToCloudinary,
} from "../services/cloudinary.service.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateBody } from "../utils/validate.js"
import {
  settingsSchema,
  type SiteSettingsInput,
} from "../validations/settings.validation.js"

type UploadedFiles = {
  logo?: Express.Multer.File[]
  darkLogo?: Express.Multer.File[]
  favicon?: Express.Multer.File[]
  companyProfile?: Express.Multer.File[]
}

const COMPANY_PROFILE_FILENAME_BASE = "company_profile"

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

function toTrimmedOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
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

function getCompanyProfileResourceType(url?: string | null) {
  if (url?.includes("/raw/upload/")) {
    return "raw"
  }

  return "image"
}

function getCompanyProfileFileExtension(
  url: string,
  contentType?: string | null
) {
  try {
    const pathname = new URL(url).pathname
    const extension = pathname.split(".").pop()?.toLowerCase()

    if (extension && /^[a-z0-9]{2,8}$/.test(extension)) {
      return extension
    }
  } catch {
    // Fall back to content type below.
  }

  if (contentType?.includes("pdf")) {
    return "pdf"
  }

  return "pdf"
}

function getAttachmentHeader(filename: string) {
  return `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
    filename
  )}`
}

export const downloadCompanyProfile: RequestHandler = async (_req, res, next) => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
    })
    const companyProfileUrl = settings?.companyProfileUrl?.trim()

    if (!settings || !companyProfileUrl) {
      return res.status(404).json({
        success: false,
        message: "Company profile is not configured",
      })
    }

    const downloadUrl = settings.companyProfilePublicId
      ? cloudinary.utils.private_download_url(
          settings.companyProfilePublicId,
          "pdf",
          {
            resource_type: getCompanyProfileResourceType(companyProfileUrl),
            type: "upload",
            attachment: true,
            expires_at: Math.floor(Date.now() / 1000) + 60,
          }
        )
      : companyProfileUrl

    const fileResponse = await fetch(downloadUrl)

    if (!fileResponse.ok) {
      throw new ApiError(502, "Unable to download company profile")
    }

    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer())
    const contentType =
      fileResponse.headers.get("content-type") ?? "application/pdf"
    const fileExtension = getCompanyProfileFileExtension(
      companyProfileUrl,
      contentType
    )
    const downloadFilename = `${COMPANY_PROFILE_FILENAME_BASE}.${fileExtension}`

    res.setHeader(
      "Content-Disposition",
      getAttachmentHeader(downloadFilename)
    )
    res.setHeader("Content-Type", contentType)
    return res.send(fileBuffer)
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
    const companyProfileFile = files.companyProfile?.[0]

    if (
      companyProfileFile &&
      companyProfileFile.mimetype !== "application/pdf"
    ) {
      throw new ApiError(400, "Company profile must be a PDF")
    }

    const input = await validateBody<SiteSettingsInput>(settingsSchema, {
      officeAddressLine1: body.officeAddressLine1,
      officeAddressLine2: body.officeAddressLine2,
      mapLocation: body.mapLocation,
      mapLocationText: body.mapLocationText,
      whatsappNumber: body.whatsappNumber,
      companyProfileUrl: body.companyProfileUrl,
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
    let companyProfileUrl: string | null | undefined =
      existing.companyProfileUrl ?? undefined
    let companyProfilePublicId: string | null | undefined =
      existing.companyProfilePublicId ?? undefined

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

    const staleIds: string[] = []

    if (companyProfileFile) {
      const upload = await uploadToCloudinary(companyProfileFile)
      companyProfileUrl = upload.secure_url
      companyProfilePublicId = upload.public_id
      uploadedPublicIds.push(upload.public_id)
      if (existing.companyProfilePublicId) {
        staleIds.push(existing.companyProfilePublicId)
      }
    } else if (input.companyProfileUrl !== undefined) {
      const nextCompanyProfileUrl = toTrimmedOptionalString(
        input.companyProfileUrl
      )
      companyProfileUrl = nextCompanyProfileUrl ?? null

      if (nextCompanyProfileUrl !== existing.companyProfileUrl) {
        if (existing.companyProfilePublicId) {
          staleIds.push(existing.companyProfilePublicId)
        }
        companyProfilePublicId = null
      }
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
        whatsappNumber: input.whatsappNumber,
        companyProfileUrl,
        companyProfilePublicId,
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
