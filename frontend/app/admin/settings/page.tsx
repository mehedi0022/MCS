"use client"

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  FileText,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  useSiteSettings,
  type SiteSettings,
  type SocialLink,
} from "@/context/site-settings-context"
import { DynamicModal } from "@/components/DynamicModal"
import { ImageCropperDialog } from "@/components/shared/ImageCropperDialog"
import {
  getVisibleSocialLinks,
  SOCIAL_PLATFORMS,
  toFixedSocialLinks,
} from "@/lib/social-links"

type BrandCropTarget = "logo" | "darkLogo" | "favicon"

const LOGO_IMAGE_WIDTH = 900
const LOGO_IMAGE_HEIGHT = 360
const LOGO_IMAGE_ASPECT = LOGO_IMAGE_WIDTH / LOGO_IMAGE_HEIGHT
const LOGO_IMAGE_SIZE_LABEL = `${LOGO_IMAGE_WIDTH} x ${LOGO_IMAGE_HEIGHT}px`
const FAVICON_IMAGE_SIZE = 512
const FAVICON_IMAGE_SIZE_LABEL = `${FAVICON_IMAGE_SIZE} x ${FAVICON_IMAGE_SIZE}px`

export default function AdminSettingsPage() {
  const { refreshSettings } = useSiteSettings()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)

  const [logoUrl, setLogoUrl] = useState("")
  const [darkLogoUrl, setDarkLogoUrl] = useState("")
  const [navbarBrandText, setNavbarBrandText] = useState("")
  const [navbarBrandAccent, setNavbarBrandAccent] = useState("")
  const [navbarBrandSubtext, setNavbarBrandSubtext] = useState("")
  const [footerBrandText, setFooterBrandText] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropTarget, setCropTarget] = useState<BrandCropTarget | null>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [officeAddressLine1, setOfficeAddressLine1] = useState("")
  const [officeAddressLine2, setOfficeAddressLine2] = useState("")
  const [mapLocation, setMapLocation] = useState("")
  const [mapLocationText, setMapLocationText] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [companyProfileUrl, setCompanyProfileUrl] = useState("")
  const [companyProfileFile, setCompanyProfileFile] = useState<File | null>(
    null
  )
  const [contactEmails, setContactEmails] = useState<string[]>([""])
  const [contactPhones, setContactPhones] = useState<string[]>([""])
  const [branches, setBranches] = useState<string[]>([""])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    toFixedSocialLinks(null)
  )

  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : logoUrl),
    [logoFile, logoUrl]
  )
  const darkLogoPreview = useMemo(
    () => (darkLogoFile ? URL.createObjectURL(darkLogoFile) : darkLogoUrl),
    [darkLogoFile, darkLogoUrl]
  )
  const faviconPreview = useMemo(
    () => (faviconFile ? URL.createObjectURL(faviconFile) : faviconUrl),
    [faviconFile, faviconUrl]
  )
  const cropConfig = useMemo(() => {
    if (cropTarget === "favicon") {
      return {
        title: "Crop Favicon",
        description: `Output size: ${FAVICON_IMAGE_SIZE_LABEL}. Use a centered square mark for best browser tab display.`,
        outputWidth: FAVICON_IMAGE_SIZE,
        outputHeight: FAVICON_IMAGE_SIZE,
        aspect: 1,
        fileNamePrefix: "favicon",
      }
    }

    return {
      title:
        cropTarget === "darkLogo" ? "Crop White Logo" : "Crop Light Mode Logo",
      description: `Output size: ${LOGO_IMAGE_SIZE_LABEL}. Keep transparent space only if the logo needs it.`,
      outputWidth: LOGO_IMAGE_WIDTH,
      outputHeight: LOGO_IMAGE_HEIGHT,
      aspect: LOGO_IMAGE_ASPECT,
      fileNamePrefix: cropTarget === "darkLogo" ? "dark-logo" : "logo",
    }
  }, [cropTarget])

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
      if (darkLogoPreview.startsWith("blob:"))
        URL.revokeObjectURL(darkLogoPreview)
      if (faviconPreview.startsWith("blob:"))
        URL.revokeObjectURL(faviconPreview)
    }
  }, [logoPreview, darkLogoPreview, faviconPreview])

  useEffect(() => {
    void loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setIsLoading(true)
      const response = await api.get<ApiResponse<SiteSettings>>("/settings")
      const data = response.data.data

      setLogoUrl(data.logoUrl ?? "")
      setDarkLogoUrl(data.darkLogoUrl ?? "")
      setNavbarBrandText(data.navbarBrandText ?? "")
      setNavbarBrandAccent(data.navbarBrandAccent ?? "")
      setNavbarBrandSubtext(data.navbarBrandSubtext ?? "")
      setFooterBrandText(data.footerBrandText ?? "")
      setFaviconUrl(data.faviconUrl ?? "")
      setOfficeAddressLine1(data.officeAddressLine1 ?? "")
      setOfficeAddressLine2(data.officeAddressLine2 ?? "")
      setMapLocation(data.mapLocation ?? "")
      setMapLocationText(data.mapLocationText ?? "")
      setWhatsappNumber(data.whatsappNumber ?? "")
      setCompanyProfileUrl(data.companyProfileUrl ?? "")
      setCompanyProfileFile(null)
      setContactEmails(
        data.contactEmails && data.contactEmails.length > 0
          ? data.contactEmails
          : [""]
      )
      setContactPhones(
        data.contactPhones && data.contactPhones.length > 0
          ? data.contactPhones
          : [""]
      )
      setBranches(
        data.branches && data.branches.length > 0 ? data.branches : [""]
      )
      setSocialLinks(toFixedSocialLinks(data.socialLinks))
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  function updateArrayItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) {
    setter((current) => current.map((item, i) => (i === index ? value : item)))
  }

  function removeArrayItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) {
    setter((current) =>
      current.length === 1 ? current : current.filter((_, i) => i !== index)
    )
  }

  function openCropper(file: File, target: BrandCropTarget) {
    setCropFile(file)
    setCropTarget(target)
    setCropOpen(true)
  }

  function clearCropper() {
    setCropOpen(false)
    setCropFile(null)
    setCropTarget(null)
  }

  function handleBrandAssetSelect(
    event: ChangeEvent<HTMLInputElement>,
    target: BrandCropTarget
  ) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""

    if (!file) {
      return
    }

    openCropper(file, target)
  }

  function handleCompanyProfileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""

    if (!file) {
      return
    }

    setCompanyProfileFile(file)
  }

  function handleCropOpenChange(open: boolean) {
    setCropOpen(open)

    if (!open) {
      setCropFile(null)
      setCropTarget(null)
    }
  }

  function handleCroppedBrandAsset(file: File) {
    if (cropTarget === "darkLogo") {
      setDarkLogoFile(file)
    } else if (cropTarget === "favicon") {
      setFaviconFile(file)
    } else {
      setLogoFile(file)
    }

    clearCropper()
  }

  async function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)
    setSaveLoadingOpen(true)

    try {
      const payload = new FormData()
      payload.append("officeAddressLine1", officeAddressLine1)
      payload.append("officeAddressLine2", officeAddressLine2)
      payload.append("mapLocation", mapLocation)
      payload.append("mapLocationText", mapLocationText)
      payload.append("whatsappNumber", whatsappNumber)
      payload.append("companyProfileUrl", companyProfileUrl)
      payload.append("logoUrl", logoUrl)
      payload.append("darkLogoUrl", darkLogoUrl)
      payload.append("navbarBrandText", navbarBrandText)
      payload.append("navbarBrandAccent", navbarBrandAccent)
      payload.append("navbarBrandSubtext", navbarBrandSubtext)
      payload.append("footerBrandText", footerBrandText)
      payload.append("faviconUrl", faviconUrl)
      payload.append(
        "contactEmails",
        JSON.stringify(contactEmails.filter((item) => item.trim()))
      )
      payload.append(
        "contactPhones",
        JSON.stringify(contactPhones.filter((item) => item.trim()))
      )
      payload.append(
        "branches",
        JSON.stringify(branches.filter((item) => item.trim()))
      )
      payload.append(
        "socialLinks",
        JSON.stringify(getVisibleSocialLinks(socialLinks))
      )

      if (logoFile) payload.append("logo", logoFile)
      if (darkLogoFile) payload.append("darkLogo", darkLogoFile)
      if (faviconFile) payload.append("favicon", faviconFile)
      if (companyProfileFile) {
        payload.append("companyProfile", companyProfileFile)
      }

      await api.put("/settings", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setLogoFile(null)
      setDarkLogoFile(null)
      setFaviconFile(null)
      setCompanyProfileFile(null)
      setSuccess("Settings updated successfully.")
      await refreshSettings()
      await loadSettings()
    } catch (saveError) {
      setSaveLoadingOpen(false)
      setError(getApiErrorMessage(saveError))
    } finally {
      setSaveLoadingOpen(false)
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto space-y-6 px-6">
        <div className="shadow-maritime-sm flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Update logo, contacts, branches, map, website actions, and
                social links.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={submitSettings}
          className="shadow-maritime-sm space-y-6 rounded-xl border border-border bg-card p-5"
        >
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Brand Assets
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Light Mode Logo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Use the dark/navy logo for light backgrounds.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="/mcs_logo.png"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="border-input px-3"
                      />
                      <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-border px-3 text-xs font-bold uppercase hover:bg-muted">
                        <ImagePlus className="size-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) =>
                            handleBrandAssetSelect(event, "logo")
                          }
                        />
                      </label>
                    </div>
                    {logoPreview && (
                      <div className="relative h-20 w-44 overflow-hidden rounded-lg border border-border bg-white p-3">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-contain p-3"
                          unoptimized={logoPreview.startsWith("blob:")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      White Logo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Use the white logo for dark backgrounds.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="/mcs_logo_dark.png"
                        value={darkLogoUrl}
                        onChange={(e) => setDarkLogoUrl(e.target.value)}
                        className="border-input px-3"
                      />
                      <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-border px-3 text-xs font-bold uppercase hover:bg-muted">
                        <ImagePlus className="size-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) =>
                            handleBrandAssetSelect(event, "darkLogo")
                          }
                        />
                      </label>
                    </div>
                    {darkLogoPreview && (
                      <div className="relative h-20 w-44 overflow-hidden rounded-lg border border-border bg-maritime-abyss p-3">
                        <Image
                          src={darkLogoPreview}
                          alt="Dark mode logo preview"
                          fill
                          className="object-contain p-3"
                          unoptimized={darkLogoPreview.startsWith("blob:")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Favicon
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 512x512 px (PNG or ICO).
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Favicon URL"
                        value={faviconUrl}
                        onChange={(e) => setFaviconUrl(e.target.value)}
                        className="border-input px-3"
                      />
                      <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-border px-3 text-xs font-bold uppercase hover:bg-muted">
                        <ImagePlus className="size-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) =>
                            handleBrandAssetSelect(event, "favicon")
                          }
                        />
                      </label>
                    </div>
                    {faviconPreview && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                        <Image
                          src={faviconPreview}
                          alt="Favicon preview"
                          fill
                          className="object-contain"
                          unoptimized={faviconPreview.startsWith("blob:")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 md:col-span-2 lg:col-span-3">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        Navbar Text
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Desktop text shown beside the logo. Hidden on mobile.
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        placeholder="Marine"
                        value={navbarBrandText}
                        onChange={(e) => setNavbarBrandText(e.target.value)}
                        className="border-input px-3"
                      />
                      <Input
                        placeholder="Consultancy"
                        value={navbarBrandAccent}
                        onChange={(e) => setNavbarBrandAccent(e.target.value)}
                        className="border-input px-3"
                      />
                      <Input
                        placeholder="Services (MCS)"
                        value={navbarBrandSubtext}
                        onChange={(e) => setNavbarBrandSubtext(e.target.value)}
                        className="border-input px-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2 lg:col-span-3">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        Footer Brand Text
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Short paragraph shown below the footer logo.
                      </p>
                    </div>
                    <Textarea
                      placeholder="Marine Consultancy Services (MCS) delivers integrated hydrographic, geospatial, and waterway consultancy solutions across Bangladesh."
                      value={footerBrandText}
                      onChange={(e) => setFooterBrandText(e.target.value)}
                      className="min-h-28"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Office & Map
                </h2>
                <p className="text-xs text-muted-foreground">
                  Enter a Google Plus Code (example: P9F9+5Q, Dhaka). URL/iframe
                  also works, but Plus Code is recommended.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Office address line 1"
                    value={officeAddressLine1}
                    onChange={(e) => setOfficeAddressLine1(e.target.value)}
                    className="border-input px-3"
                  />
                  <Input
                    placeholder="Office address line 2"
                    value={officeAddressLine2}
                    onChange={(e) => setOfficeAddressLine2(e.target.value)}
                    className="border-input px-3"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Google Plus Code (e.g. P9F9+5Q, Dhaka)"
                    value={mapLocation}
                    onChange={(e) => setMapLocation(e.target.value)}
                    className="border-input px-3"
                  />
                  <Input
                    placeholder="Map label text (e.g. Mirpur-11, Dhaka)"
                    value={mapLocationText}
                    onChange={(e) => setMapLocationText(e.target.value)}
                    className="border-input px-3"
                  />
                </div>
              </section>

              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Contact Info
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Contact Emails
                    </p>
                    {contactEmails.map((email, index) => (
                      <div
                        key={`email-${index}`}
                        className="grid grid-cols-[1fr_auto] gap-2"
                      >
                        <Input
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) =>
                            updateArrayItem(
                              setContactEmails,
                              index,
                              e.target.value
                            )
                          }
                          className="border-input px-3"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() =>
                            removeArrayItem(setContactEmails, index)
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() =>
                        setContactEmails((current) => [...current, ""])
                      }
                    >
                      <Plus className="size-4" />
                      Add Email
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Contact Phones
                    </p>
                    {contactPhones.map((phone, index) => (
                      <div
                        key={`phone-${index}`}
                        className="grid grid-cols-[1fr_auto] gap-2"
                      >
                        <Input
                          placeholder="+8801..."
                          value={phone}
                          onChange={(e) =>
                            updateArrayItem(
                              setContactPhones,
                              index,
                              e.target.value
                            )
                          }
                          className="border-input px-3"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() =>
                            removeArrayItem(setContactPhones, index)
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() =>
                        setContactPhones((current) => [...current, ""])
                      }
                    >
                      <Plus className="size-4" />
                      Add Phone
                    </Button>
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Website Actions
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        WhatsApp Number
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Use international format, for example +8801712345678.
                      </p>
                    </div>
                    <Input
                      type="tel"
                      placeholder="+8801712345678"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="border-input px-3"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        Company Profile PDF (Max 15 MB)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Upload a PDF to show the Company Profile button. (Max 15
                        MB)
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-xs font-bold uppercase hover:bg-muted">
                        <Upload className="size-4" />
                        Upload PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          className="sr-only"
                          onChange={handleCompanyProfileSelect}
                        />
                      </label>
                      {companyProfileFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => setCompanyProfileFile(null)}
                        >
                          <X className="size-4" />
                          Clear Selected
                        </Button>
                      )}
                      {companyProfileUrl && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => {
                            setCompanyProfileFile(null)
                            setCompanyProfileUrl("")
                          }}
                        >
                          <Trash2 className="size-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                    {companyProfileFile ? (
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                        <FileText className="size-4 text-primary" />
                        <span className="min-w-0 truncate">
                          {companyProfileFile.name}
                        </span>
                      </div>
                    ) : companyProfileUrl ? (
                      <Link
                        href={companyProfileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm font-semibold text-primary hover:text-maritime-ocean"
                      >
                        <FileText className="size-4 shrink-0" />
                        <span className="min-w-0 truncate">
                          View current company profile
                        </span>
                      </Link>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No company profile PDF is configured.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Branches
                </h2>
                <div className="space-y-3">
                  {branches.map((branch, index) => (
                    <div
                      key={`branch-${index}`}
                      className="grid grid-cols-[1fr_auto] gap-2 md:w-1/2"
                    >
                      <Input
                        placeholder="Branch office"
                        value={branch}
                        onChange={(e) =>
                          updateArrayItem(setBranches, index, e.target.value)
                        }
                        className="border-input px-3"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => removeArrayItem(setBranches, index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => setBranches((current) => [...current, ""])}
                  >
                    <Plus className="size-4" />
                    Add Branch
                  </Button>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Social Links
                </h2>
                <p className="text-xs text-muted-foreground">
                  Leave a URL empty to hide that social icon from the website.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {socialLinks.map((social, index) => {
                    const config = SOCIAL_PLATFORMS[index]

                    return (
                      <div key={social.platform} className="space-y-2">
                        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                          {social.platform}
                        </p>
                        <Input
                          placeholder={config?.placeholder ?? "https://..."}
                          value={social.url}
                          onChange={(e) =>
                            setSocialLinks((current) =>
                              current.map((item, i) =>
                                i === index
                                  ? { ...item, url: e.target.value }
                                  : item
                              )
                            )
                          }
                          className="border-input px-3"
                        />
                      </div>
                    )
                  })}
                </div>
              </section>

              <Button
                type="submit"
                className="mt-6 h-11 w-full rounded-lg"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Save Settings
              </Button>
            </>
          )}
        </form>
      </div>

      <ImageCropperDialog
        open={cropOpen}
        file={cropFile}
        title={cropConfig.title}
        description={cropConfig.description}
        outputWidth={cropConfig.outputWidth}
        outputHeight={cropConfig.outputHeight}
        aspect={cropConfig.aspect}
        outputType="image/png"
        fileNamePrefix={cropConfig.fileNamePrefix}
        onOpenChange={handleCropOpenChange}
        onCroppedFile={handleCroppedBrandAsset}
      />

      <DynamicModal
        isOpen={saveLoadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Saving..."
        description="Please wait while we update settings."
        showCloseButton={false}
      />
    </main>
  )
}
