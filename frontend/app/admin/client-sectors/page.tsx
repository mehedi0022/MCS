"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react"
import { DynamicModal } from "@/components/DynamicModal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"

type ClientSectorItem = {
  id: string
  title: string
  body: string
  points?: string[] | null
  sortOrder: number
  isPublished: boolean
}

type SectorFormState = {
  title: string
  body: string
  pointsText: string
  sortOrder: string
  isPublished: boolean
}

const emptyForm: SectorFormState = {
  title: "",
  body: "",
  pointsText: "",
  sortOrder: "0",
  isPublished: true,
}

function pointsToText(points?: string[] | null) {
  return Array.isArray(points) ? points.join("\n") : ""
}

function textToPoints(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function AdminClientSectorsPage() {
  const router = useRouter()
  const [sectors, setSectors] = useState<ClientSectorItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<SectorFormState>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false)
  const [deleteLoadingOpen, setDeleteLoadingOpen] = useState(false)
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)

  const selected = useMemo(
    () => sectors.find((item) => item.id === selectedId),
    [sectors, selectedId]
  )

  const loadSectors = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const response =
        await api.get<ApiResponse<ClientSectorItem[]>>("/client-sectors/admin")
      const rows = response.data.data.map((item) => ({
        ...item,
        points: Array.isArray(item.points) ? item.points : [],
      }))
      setSectors(rows)
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
      void loadSectors()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadSectors])

  function updateField<K extends keyof SectorFormState>(
    key: K,
    value: SectorFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setSuccess("")
    setError("")
  }

  function startEdit(item: ClientSectorItem) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      body: item.body,
      pointsText: pointsToText(item.points),
      sortOrder: String(item.sortOrder ?? 0),
      isPublished: item.isPublished,
    })
    setSuccess("")
    setError("")
  }

  function formPayload() {
    return {
      title: form.title,
      body: form.body,
      points: textToPoints(form.pointsText),
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      isPublished: form.isPublished,
    }
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)
    setSaveLoadingOpen(true)

    try {
      if (editingId) {
        await api.put(`/client-sectors/${editingId}`, formPayload())
        setSuccess("Sector updated successfully.")
      } else {
        await api.post("/client-sectors", formPayload())
        setSuccess("Sector created successfully.")
      }

      await loadSectors()
      if (!editingId) {
        setForm(emptyForm)
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
      await api.delete(`/client-sectors/${selected.id}`)
      setDeleteLoadingOpen(false)
      setDeleteSuccessOpen(true)
      setSuccess("Sector deleted successfully.")
      if (editingId === selected.id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      await loadSectors()
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
              <h1 className="text-2xl font-bold">Client Sectors</h1>
              <p className="text-sm text-muted-foreground">
                Manage the sector cards on the Clients & Sectors page.
              </p>
            </div>
          </div>
          <Button className="rounded-lg" onClick={startCreate}>
            <Plus className="size-4" />
            New Sector
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
          <section className="rounded-xl border border-border bg-card p-4 shadow-maritime-sm">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : sectors.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  No sector cards yet.
                </div>
              ) : (
                sectors.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${selectedId === item.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/40"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-semibold">{item.title}</p>
                      {!item.isPublished && (
                        <span className="rounded-md px-2 py-1 text-[10px] font-bold uppercase text-amber-600">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {item.body}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-maritime-sm">
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
              <div className="grid gap-3 md:grid-cols-[1fr_120px]">
                <Input
                  required
                  placeholder="Sector title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="border-input px-3"
                />
                <Input
                  type="number"
                  placeholder="Order"
                  value={form.sortOrder}
                  onChange={(e) => updateField("sortOrder", e.target.value)}
                  className="border-input px-3"
                />
              </div>

              <Textarea
                required
                placeholder="Short sector description"
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                className="min-h-28"
              />

              <Textarea
                placeholder="One bullet point per line"
                value={form.pointsText}
                onChange={(e) => updateField("pointsText", e.target.value)}
                className="min-h-36"
              />

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isPublished}
                  onCheckedChange={(value) =>
                    updateField("isPublished", value === true)
                  }
                />
                Published
              </label>

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
                {editingId ? "Update Sector" : "Create Sector"}
              </Button>
            </form>

            {(form.title || form.body) && (
              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Preview
                </p>
                <h2 className="text-xl font-bold">{form.title || "Sector title"}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {form.body || "Sector description"}
                </p>
                {textToPoints(form.pointsText).length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm">
                    {textToPoints(form.pointsText).map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
        description="Please wait while we save the sector card."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        type="warning"
        title="Delete Sector?"
        description="This will permanently remove the selected sector card."
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
        description="Please wait while we remove the sector card."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
        type="success"
        title="Deleted"
        description="Sector card removed successfully."
        actionText="Continue"
      />
    </main>
  )
}
