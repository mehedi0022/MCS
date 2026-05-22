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
} from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { DynamicModal } from "@/components/DynamicModal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type JourneyItem = {
  id: string
  year: string
  title: string
  desc: string
  sortOrder: number
  isActive: boolean
}

type FormState = {
  year: string
  title: string
  desc: string
  sortOrder: number
  isActive: boolean
}

const emptyForm: FormState = {
  year: "",
  title: "",
  desc: "",
  sortOrder: 0,
  isActive: true,
}

export default function AdminJourneyPage() {
  const router = useRouter()
  const [items, setItems] = useState<JourneyItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false)
  const [deleteLoadingOpen, setDeleteLoadingOpen] = useState(false)
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId]
  )

  useEffect(() => {
    void loadItems()
  }, [])

  async function loadItems() {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.get<ApiResponse<JourneyItem[]>>("/journey/admin")
      const rows = response.data.data
      setItems(rows)
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

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setSuccess("")
    setError("")
  }

  function startEdit(item: JourneyItem) {
    setEditingId(item.id)
    setForm({
      year: item.year,
      title: item.title,
      desc: item.desc,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })
    setSuccess("")
    setError("")
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)
    setSaveLoadingOpen(true)

    try {
      if (editingId) {
        await api.put(`/journey/${editingId}`, form)
        setSuccess("Journey milestone updated successfully.")
      } else {
        await api.post("/journey", form)
        setSuccess("Journey milestone created successfully.")
      }
      await loadItems()
      if (!editingId) setForm(emptyForm)
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
      setDeleteLoadingOpen(true)
      await api.delete(`/journey/${selected.id}`)
      setDeleteLoadingOpen(false)
      setDeleteSuccessOpen(true)
      setSuccess("Journey milestone deleted successfully.")
      if (editingId === selected.id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      await loadItems()
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
              <h1 className="text-2xl font-bold">Journey Admin</h1>
              <p className="text-sm text-muted-foreground">
                Manage About page timeline milestones.
              </p>
            </div>
          </div>
          <Button className="rounded-lg" onClick={startCreate}>
            <Plus className="size-4" />
            New Milestone
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

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <section className="rounded-xl border border-border bg-card p-4 shadow-maritime-sm">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  No milestones yet.
                </div>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${selectedId === item.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/40"}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="line-clamp-1 font-semibold">{item.title}</p>
                      {!item.isActive && (
                        <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase text-amber-600">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.year} • Sort: {item.sortOrder}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-maritime-sm">
            {selected && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-lg" onClick={() => startEdit(selected)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
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
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  required
                  placeholder="Year (e.g. 2024)"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="border-input px-3"
                />
                <Input
                  required
                  placeholder="Sort Order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) =>
                    updateField("sortOrder", Number(e.target.value) || 0)
                  }
                  className="border-input px-3"
                />
              </div>

              <Input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="border-input px-3"
              />

              <Textarea
                required
                placeholder="Description"
                value={form.desc}
                onChange={(e) => updateField("desc", e.target.value)}
                className="min-h-24 border-input px-3"
              />

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isActive}
                  onCheckedChange={(value) =>
                    updateField("isActive", value === true)
                  }
                />
                Active
              </label>

              <Button type="submit" className="h-11 w-full rounded-lg" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editingId ? (
                  <Save className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                {editingId ? "Update Milestone" : "Create Milestone"}
              </Button>
            </form>
          </section>
        </div>
      </div>

      <DynamicModal
        isOpen={saveLoadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Saving..."
        description="Please wait while we save the milestone."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        type="warning"
        title="Delete Milestone?"
        description="This will permanently remove the selected journey milestone."
        actionText="Confirm Delete"
        onAction={() => {
          setDeleteWarningOpen(false)
          void deleteSelected()
        }}
      />

      <DynamicModal
        isOpen={deleteLoadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Deleting..."
        description="Please wait while we remove the milestone."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
        type="success"
        title="Deleted"
        description="Journey milestone removed successfully."
        actionText="Continue"
      />
    </main>
  )
}




