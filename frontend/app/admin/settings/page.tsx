"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSiteSettings, type SiteSettings, type SocialLink } from "@/context/site-settings-context"
import { DynamicModal } from "@/components/DynamicModal"

export default function AdminSettingsPage() {
  const { refreshSettings } = useSiteSettings()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)

  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [officeAddressLine1, setOfficeAddressLine1] = useState("")
  const [officeAddressLine2, setOfficeAddressLine2] = useState("")
  const [mapLocation, setMapLocation] = useState("")
  const [mapLocationText, setMapLocationText] = useState("")
  const [contactEmails, setContactEmails] = useState<string[]>([""])
  const [contactPhones, setContactPhones] = useState<string[]>([""])
  const [branches, setBranches] = useState<string[]>([""])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "", url: "" },
  ])

  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : logoUrl),
    [logoFile, logoUrl]
  )
  const faviconPreview = useMemo(
    () => (faviconFile ? URL.createObjectURL(faviconFile) : faviconUrl),
    [faviconFile, faviconUrl]
  )

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
      if (faviconPreview.startsWith("blob:"))
        URL.revokeObjectURL(faviconPreview)
    }
  }, [logoPreview, faviconPreview])

  useEffect(() => {
    void loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setIsLoading(true)
      const response = await api.get<ApiResponse<SiteSettings>>("/settings")
      const data = response.data.data

      setLogoUrl(data.logoUrl ?? "")
      setFaviconUrl(data.faviconUrl ?? "")
      setOfficeAddressLine1(data.officeAddressLine1 ?? "")
      setOfficeAddressLine2(data.officeAddressLine2 ?? "")
      setMapLocation(data.mapLocation ?? "")
      setMapLocationText(data.mapLocationText ?? "")
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
      setSocialLinks(
        data.socialLinks && data.socialLinks.length > 0
          ? data.socialLinks
          : [{ platform: "", url: "" }]
      )
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

  async function submitSettings(event: React.FormEvent<HTMLFormElement>) {
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
      payload.append("logoUrl", logoUrl)
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
        JSON.stringify(
          socialLinks.filter(
            (item) => item.platform.trim() && item.url.trim()
          )
        )
      )

      if (logoFile) payload.append("logo", logoFile)
      if (faviconFile) payload.append("favicon", faviconFile)

      await api.put("/settings", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setLogoFile(null)
      setFaviconFile(null)
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
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-maritime-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Update logo, contacts, branches, map, and social links.
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
          className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-maritime-sm"
        >
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Brand Assets
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Logo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 320x100 px (PNG, transparent background).
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Logo URL"
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
                          onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                    {logoPreview && (
                      <div className="relative h-20 w-40 overflow-hidden rounded-lg border border-border">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-contain"
                          unoptimized={logoPreview.startsWith("blob:")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
                          onChange={(e) =>
                            setFaviconFile(e.target.files?.[0] ?? null)
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
                </div>
              </section>

              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
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
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Contact Info
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Contact Emails
                    </p>
                    {contactEmails.map((email, index) => (
                      <div key={`email-${index}`} className="grid gap-2 grid-cols-[1fr_auto]">
                        <Input
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) =>
                            updateArrayItem(setContactEmails, index, e.target.value)
                          }
                          className="border-input px-3"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => removeArrayItem(setContactEmails, index)}
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
                      onClick={() => setContactEmails((current) => [...current, ""])}
                    >
                      <Plus className="size-4" />
                      Add Email
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Contact Phones
                    </p>
                    {contactPhones.map((phone, index) => (
                      <div key={`phone-${index}`} className="grid gap-2 grid-cols-[1fr_auto]">
                        <Input
                          placeholder="+8801..."
                          value={phone}
                          onChange={(e) =>
                            updateArrayItem(setContactPhones, index, e.target.value)
                          }
                          className="border-input px-3"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => removeArrayItem(setContactPhones, index)}
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
                      onClick={() => setContactPhones((current) => [...current, ""])}
                    >
                      <Plus className="size-4" />
                      Add Phone
                    </Button>
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border border-border p-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Branches
                </h2>
                <div className="space-y-3">
                  {branches.map((branch, index) => (
                    <div key={`branch-${index}`} className="grid gap-2 grid-cols-[1fr_auto] md:w-1/2">
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
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Social Links
                </h2>
                <div className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <div key={`social-${index}`} className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_1fr_auto]">
                      <Input
                        placeholder="Platform (Facebook)"
                        value={social.platform}
                        onChange={(e) =>
                          setSocialLinks((current) =>
                            current.map((item, i) =>
                              i === index
                                ? { ...item, platform: e.target.value }
                                : item
                            )
                          )
                        }
                        className="border-input px-3"
                      />
                      <Input
                        placeholder="https://..."
                        value={social.url}
                        onChange={(e) =>
                          setSocialLinks((current) =>
                            current.map((item, i) =>
                              i === index ? { ...item, url: e.target.value } : item
                            )
                          )
                        }
                        className="border-input px-3"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="w-full md:w-auto"
                        onClick={() =>
                          setSocialLinks((current) =>
                            current.length === 1
                              ? current
                              : current.filter((_, i) => i !== index)
                          )
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
                      setSocialLinks((current) => [...current, { platform: "", url: "" }])
                    }
                  >
                    <Plus className="size-4" />
                    Add Social Link
                  </Button>
                </div>
              </section>

              <Button type="submit" className="h-11 w-full rounded-lg mt-6" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                Save Settings
              </Button>
            </>
          )}
        </form>
      </div>

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



