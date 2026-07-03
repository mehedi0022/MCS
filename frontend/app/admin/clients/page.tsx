"use client"

import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ExternalLink,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { DynamicModal } from "@/components/DynamicModal"
import { ImageCropperDialog } from "@/components/shared/ImageCropperDialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

type ClientItem = {
  id: string
  name: string
  logoUrl?: string | null
  logoPublicId?: string | null
  website?: string | null
  isFeatured: boolean
  isPublished: boolean
}

type ClientFormState = {
  name: string
  logoUrl: string
  website: string
  isFeatured: boolean
  isPublished: boolean
}

const emptyForm: ClientFormState = {
  name: "",
  logoUrl: "",
  website: "",
  isFeatured: false,
  isPublished: true,
}

const CLIENT_LOGO_WIDTH = 640
const CLIENT_LOGO_HEIGHT = 280
const CLIENT_LOGO_ASPECT = CLIENT_LOGO_WIDTH / CLIENT_LOGO_HEIGHT

function toSafeWebsite(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }
  return `https://${trimmed}`
}

export default function AdminClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ClientFormState>(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false)
  const [deleteLoadingOpen, setDeleteLoadingOpen] = useState(false)
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)

  const selected = useMemo(
    () => clients.find((item) => item.id === selectedId),
    [clients, selectedId]
  )

  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : form.logoUrl),
    [logoFile, form.logoUrl]
  )

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.get<ApiResponse<ClientItem[]>>("/clients/admin")
      const rows = response.data.data
      setClients(rows)
      setSelectedId((current) =>
        rows.some((item) => item.id === current) ? current : (rows[0]?.id ?? "")
      )
    } catch (loadError) {
      const message = getApiErrorMessage(loadError)
      if (message.toLowerCase().includes("auth")) {
        router.replace("/login")
        return
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadClients()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadClients])

  function updateField<K extends keyof ClientFormState>(
    key: K,
    value: ClientFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleLogoSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""

    if (!file) {
      return
    }

    setCropFile(file)
    setCropOpen(true)
  }

  function handleCropOpenChange(open: boolean) {
    setCropOpen(open)

    if (!open) {
      setCropFile(null)
    }
  }

  function handleCroppedLogo(file: File) {
    setLogoFile(file)
    setCropFile(null)
    setCropOpen(false)
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setLogoFile(null)
    setSuccess("")
    setError("")
  }

  function startEdit(item: ClientItem) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      logoUrl: item.logoUrl ?? "",
      website: item.website ?? "",
      isFeatured: item.isFeatured,
      isPublished: item.isPublished,
    })
    setLogoFile(null)
    setSuccess("")
    setError("")
  }

  function formDataFromState() {
    const payload = new FormData()
    payload.append("name", form.name)
    payload.append("logoUrl", form.logoUrl)
    payload.append("website", form.website)
    payload.append("isFeatured", String(form.isFeatured))
    payload.append("isPublished", String(form.isPublished))
    if (logoFile) {
      payload.append("logo", logoFile)
    }
    return payload
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)
    setSaveLoadingOpen(true)

    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, formDataFromState(), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setSuccess("Client updated successfully.")
      } else {
        await api.post("/clients", formDataFromState(), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setSuccess("Client created successfully.")
      }

      await loadClients()
      if (!editingId) {
        setForm(emptyForm)
        setLogoFile(null)
      }
    } catch (submitError) {
      setSaveLoadingOpen(false)
      setError(getApiErrorMessage(submitError))
    } finally {
      setSaveLoadingOpen(false)
      setIsSaving(false)
    }
  }

  async function deleteSelected() {
    if (!selected) return
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")
      await api.delete(`/clients/${selected.id}`)
      setDeleteLoadingOpen(false)
      setDeleteSuccessOpen(true)
      setSuccess("Client deleted successfully.")
      if (editingId === selected.id) {
        setEditingId(null)
        setForm(emptyForm)
        setLogoFile(null)
      }
      await loadClients()
    } catch (deleteError) {
      setDeleteLoadingOpen(false)
      setError(getApiErrorMessage(deleteError))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto space-y-6 px-6">
        <div className="shadow-maritime-sm rounded-xl flex items-center justify-between border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Clients Admin</h1>
              <p className="text-sm text-muted-foreground">
                Create, update, and manage client logos and website links.
              </p>
            </div>
          </div>
          <Button className="rounded-lg" onClick={startCreate}>
            <Plus className="size-4" />
            New Client
          </Button>
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

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="shadow-maritime-sm rounded-xl border border-border bg-card p-4">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : clients.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  No clients yet.
                </div>
              ) : (
                clients.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${selectedId === item.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/40"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-semibold">{item.name}</p>
                      {!item.isPublished && (
                        <span className="rounded-md px-2 py-1 text-[10px] font-bold uppercase text-amber-600">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {item.website || "No website"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="shadow-maritime-sm space-y-4 rounded-xl border border-border bg-card p-5">
            {selected && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => startEdit(selected)}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-lg"
                  onClick={() => setDeleteWarningOpen(true)}
                  disabled={isSaving}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-4">
              <Input
                required
                placeholder="Client name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="border-input px-3"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Client website (https://...)"
                  value={form.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  className="border-input px-3"
                />
                <Input
                  placeholder="Client logo URL"
                  value={form.logoUrl}
                  onChange={(e) => updateField("logoUrl", e.target.value)}
                  className="border-input px-3"
                />
              </div>

              <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-border px-4 text-xs font-bold tracking-widest uppercase hover:bg-muted">
                <ImagePlus className="size-4" />
                Upload Client Logo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoSelect}
                />
              </label>

              {logoPreview && (
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Logo Preview
                  </p>
                  <div className="relative h-24 overflow-hidden rounded-lg border border-border bg-background p-3">
                    <Image
                      src={logoPreview}
                      alt="Client logo preview"
                      fill
                      className="object-contain"
                      unoptimized={logoPreview.startsWith("blob:")}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-5">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.isPublished}
                    onCheckedChange={(value) =>
                      updateField("isPublished", value === true)
                    }
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.isFeatured}
                    onCheckedChange={(value) =>
                      updateField("isFeatured", value === true)
                    }
                  />
                  Featured
                </label>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-lg"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editingId ? (
                  <Save className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                {editingId ? "Update Client" : "Create Client"}
              </Button>
            </form>

            {(form.name || selected) && (
              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Preview
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-28 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-2">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="Client preview logo"
                        fill
                        className="object-contain"
                        unoptimized={logoPreview.startsWith("blob:")}
                      />
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">
                        No Logo
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{form.name || selected?.name}</p>
                    {(form.website || selected?.website) && (
                      <a
                        href={toSafeWebsite(form.website || selected?.website || "")}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <DynamicModal
        isOpen={saveLoadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Saving..."
        description="Please wait while we save the client."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        type="warning"
        title="Delete Client?"
        description="This will permanently remove the selected client."
        actionText="Confirm Delete"
        onAction={() => {
          setDeleteWarningOpen(false)
          setDeleteLoadingOpen(true)
          void deleteSelected()
        }}
      />

      <DynamicModal
        isOpen={deleteLoadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Deleting..."
        description="Please wait while we remove the client."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
        type="success"
        title="Deleted"
        description="Client removed successfully."
        actionText="Continue"
      />

      <ImageCropperDialog
        open={cropOpen}
        file={cropFile}
        title="Crop Client Logo"
        description="Output size: 640 x 280px. Use a rectangular crop so logos look consistent in the carousel."
        outputWidth={CLIENT_LOGO_WIDTH}
        outputHeight={CLIENT_LOGO_HEIGHT}
        aspect={CLIENT_LOGO_ASPECT}
        outputType="image/png"
        fileNamePrefix="client-logo"
        onOpenChange={handleCropOpenChange}
        onCroppedFile={handleCroppedLogo}
      />
    </main>
  )
}





