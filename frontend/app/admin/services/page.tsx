"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Anchor,
  ArrowLeft,
  BarChart3,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Wrench,
} from "lucide-react"
import { icons } from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { DynamicModal } from "@/components/DynamicModal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ServiceItem = {
  id: string
  title: string
  slug?: string
  summary: string
  points?: string[] | null
  description?: string | null
  icon?: string | null
  isFeatured: boolean
  isPublished: boolean
}

type ServiceFormState = {
  title: string
  summary: string
  pointsText: string
  description: string
  icon: string
  isFeatured: boolean
  isPublished: boolean
}

const emptyForm: ServiceFormState = {
  title: "",
  summary: "",
  pointsText: "",
  description: "",
  icon: "Anchor",
  isFeatured: false,
  isPublished: true,
}

const iconOptions = [
  "Anchor",
  "ShipWheel",
  "Navigation",
  "Compass",
  "Map",
  "MapPinned",
  "MapPin",
  "Waves",
  "Fish",
  "Sailboat",
  "Radar",
  "Route",
  "Milestone",
  "Globe",
  "Globe2",
  "Landmark",
  "Building2",
  "Factory",
  "Warehouse",
  "HardHat",
  "DraftingCompass",
  "Ruler",
  "Gauge",
  "Cog",
  "Wrench",
  "Hammer",
  "Pickaxe",
  "Drill",
  "ShieldCheck",
  "ShieldAlert",
  "ClipboardCheck",
  "FileCheck2",
  "CheckCircle2",
  "BadgeCheck",
  "LifeBuoy",
  "AlertTriangle",
  "ScanLine",
  "Satellite",
  "Cable",
  "Network",
  "BarChart3",
  "LineChart",
  "PieChart",
  "ChartNoAxesCombined",
  "Database",
  "Binary",
  "Workflow",
  "Layers3",
  "Search",
  "SearchCheck",
  "Microscope",
  "Ship",
  "Truck",
  "Container",
] as const

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
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false)
  const [deleteLoadingOpen, setDeleteLoadingOpen] = useState(false)
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)

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
      summary: item.summary,
      pointsText: (item.points ?? []).join("\n"),
      description: item.description ?? "",
      icon: item.icon ?? "Anchor",
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
    setSaveLoadingOpen(true)

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, {
          ...form,
          points: form.pointsText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        })
        setSuccess("Service updated successfully.")
      } else {
        await api.post("/services", {
          ...form,
          points: form.pointsText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        })
        setSuccess("Service created successfully.")
      }

      await loadServices()
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
      await api.delete(`/services/${selected.id}`)
      setDeleteLoadingOpen(false)
      setDeleteSuccessOpen(true)
      setSuccess("Service deleted successfully.")
      if (editingId === selected.id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      await loadServices()
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
              <h1 className="text-2xl font-bold">Services Admin</h1>
              <p className="text-sm text-muted-foreground">
                Create, update, publish, and manage service items.
              </p>
            </div>
          </div>
          <Button className="rounded-lg" onClick={startCreate}>
            <Plus className="size-4" />
            New Service
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
              <div className="grid gap-3 md:grid-cols-1">
                <Input
                  required
                  placeholder="Service title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
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
                placeholder="Bullet list items (one per line)"
                value={form.pointsText}
                onChange={(e) => updateField("pointsText", e.target.value)}
                className="min-h-24 border-input px-3"
              />

              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="min-h-24 border-input px-3"
              />

              <Select
                value={form.icon}
                onValueChange={(value) => updateField("icon", value ?? "Anchor")}
              >
                <SelectTrigger className="border-input">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      {iconName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                {editingId ? "Update Service" : "Create Service"}
              </Button>
            </form>

            {selected && (
              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Preview
                </p>
                <div className="mb-2 inline-flex rounded-md bg-muted p-2">
                  {(() => {
                    const Icon =
                      (icons[form.icon as keyof typeof icons] as typeof Anchor) ??
                      Wrench
                    return <Icon className="size-5 text-primary" />
                  })()}
                </div>
                <h3 className="font-semibold">{selected.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{selected.summary}</p>
                {(selected.points ?? []).length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {selected.points?.map((point, idx) => (
                      <li key={`${selected.id}-point-${idx}`}>{point}</li>
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
        description="Please wait while we save the service."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        type="warning"
        title="Delete Service?"
        description="This will permanently remove the selected service."
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
        description="Please wait while we remove the service."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
        type="success"
        title="Deleted"
        description="Service removed successfully."
        actionText="Continue"
      />
    </main>
  )
}





