"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Wrench,
} from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ServiceItem = {
  id: string
  title: string
  slug: string
  summary: string
  description?: string | null
  icon?: string | null
  isFeatured: boolean
  isPublished: boolean
}

type ServiceFormState = {
  title: string
  slug: string
  summary: string
  description: string
  icon: string
  isFeatured: boolean
  isPublished: boolean
}

const emptyForm: ServiceFormState = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  icon: "",
  isFeatured: false,
  isPublished: true,
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ServiceFormState>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const selected = useMemo(
    () => services.find((item) => item.id === selectedId),
    [services, selectedId]
  )

  useEffect(() => {
    void loadServices()
  }, [])

  async function loadServices() {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.get<ApiResponse<ServiceItem[]>>("/services/admin")
      const rows = response.data.data
      setServices(rows)
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
  }

  function updateField<K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setSuccess("")
    setError("")
  }

  function startEdit(item: ServiceItem) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      description: item.description ?? "",
      icon: item.icon ?? "",
      isFeatured: item.isFeatured,
      isPublished: item.isPublished,
    })
    setSuccess("")
    setError("")
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, form)
        setSuccess("Service updated successfully.")
      } else {
        await api.post("/services", form)
        setSuccess("Service created successfully.")
      }

      await loadServices()
      if (!editingId) {
        setForm(emptyForm)
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteSelected() {
    if (!selected) return
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")
      await api.delete(`/services/${selected.id}`)
      setSuccess("Service deleted successfully.")
      if (editingId === selected.id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      await loadServices()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto space-y-6 px-6">
        <div className="flex items-center justify-between border border-border bg-card p-4 shadow-maritime-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex h-9 items-center gap-2 border border-border px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Services Admin</h1>
              <p className="text-sm text-muted-foreground">
                Create, update, publish, and manage service items.
              </p>
            </div>
          </div>
          <Button className="rounded-none" onClick={startCreate}>
            <Plus className="size-4" />
            New Service
          </Button>
        </div>

        {error && (
          <div className="border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="border border-border bg-card p-4 shadow-maritime-sm">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : services.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  No services yet.
                </div>
              ) : (
                services.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full border p-3 text-left ${selectedId === item.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/40"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-semibold">{item.title}</p>
                      {!item.isPublished && (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase text-amber-600">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      /{item.slug}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="space-y-4 border border-border bg-card p-5 shadow-maritime-sm">
            {selected && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none"
                  onClick={() => startEdit(selected)}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-none"
                  onClick={deleteSelected}
                  disabled={isSaving}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  required
                  placeholder="Service title"
                  value={form.title}
                  onChange={(e) => {
                    const value = e.target.value
                    updateField("title", value)
                    if (!editingId) {
                      updateField("slug", makeSlug(value))
                    }
                  }}
                  className="border-input px-3"
                />
                <Input
                  required
                  placeholder="slug"
                  value={form.slug}
                  onChange={(e) => updateField("slug", makeSlug(e.target.value))}
                  className="border-input px-3"
                />
              </div>

              <Textarea
                required
                placeholder="Summary"
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                className="min-h-20 border-input px-3"
              />

              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="min-h-24 border-input px-3"
              />

              <Input
                placeholder="Icon URL (optional)"
                value={form.icon}
                onChange={(e) => updateField("icon", e.target.value)}
                className="border-input px-3"
              />

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
                className="h-11 w-full rounded-none"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editingId ? (
                  <Save className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                {editingId ? "Update Service" : "Create Service"}
              </Button>
            </form>

            {selected && (
              <div className="border border-border/70 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Preview
                </p>
                <div className="mb-2 inline-flex rounded-lg bg-muted p-2">
                  <Wrench className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold">{selected.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{selected.summary}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
