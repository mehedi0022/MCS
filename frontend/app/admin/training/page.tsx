"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Anchor,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Map,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  Wrench,
} from "lucide-react"
import { icons } from "lucide-react"
import { DynamicModal } from "@/components/DynamicModal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"

type TrainingSection = "AREA" | "MODE" | "STEP" | "OUTCOME" | "STAT"

type TrainingPageContent = {
  heroBadge: string
  heroTitleLine1: string
  heroTitleHighlight: string
  heroDescription: string
  snapshotEyebrow: string
  learningPathTitle: string
  outcomesTitle: string
  ctaTitle: string
  ctaDescription: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  isActive: boolean
}

type TrainingItem = {
  id: string
  section: TrainingSection
  title: string
  description?: string | null
  iconKey?: string | null
  value?: string | null
  sortOrder: number
  isActive: boolean
}

type TrainingAdminResponse = {
  page: TrainingPageContent
  items: TrainingItem[]
}

type ItemFormState = {
  section: TrainingSection
  title: string
  description: string
  iconKey: string
  value: string
  sortOrder: number
  isActive: boolean
}

const sectionOptions: { value: TrainingSection; label: string }[] = [
  { value: "AREA", label: "Training Areas" },
  { value: "MODE", label: "Delivery Modes" },
  { value: "STEP", label: "Learning Path" },
  { value: "OUTCOME", label: "Expected Outcomes" },
  { value: "STAT", label: "Program Snapshot" },
]

const iconOptions = [
  "Anchor",
  "GraduationCap",
  "Briefcase",
  "Users",
  "Map",
  "BarChart3",
  "CheckCircle2",
  "Compass",
  "Navigation",
  "Waves",
  "ShipWheel",
  "Globe2",
  "Route",
  "Radar",
  "Database",
  "Workflow",
] as const

const emptyPageForm: TrainingPageContent = {
  heroBadge: "Training & Capacity Development",
  heroTitleLine1: "Build Teams That Deliver",
  heroTitleHighlight: "Accurate Waterway Data",
  heroDescription:
    "Structured, field-driven training for hydrography, GIS, morphology, and nautical charting, designed for practical project execution across Bangladesh.",
  snapshotEyebrow: "Program Snapshot",
  learningPathTitle: "Learning Path",
  outcomesTitle: "Expected Outcomes",
  ctaTitle: "Need a Custom Training Plan?",
  ctaDescription:
    "We design role-based programs for agencies, project teams, and technical units aligned with your timeline, tools, and outcomes.",
  primaryButtonText: "Request Training Plan",
  primaryButtonLink: "/contact",
  secondaryButtonText: "View FAQ",
  secondaryButtonLink: "/faq",
  isActive: true,
}

const emptyItemForm: ItemFormState = {
  section: "AREA",
  title: "",
  description: "",
  iconKey: "GraduationCap",
  value: "",
  sortOrder: 0,
  isActive: true,
}

function getSectionMeta(section: TrainingSection) {
  switch (section) {
    case "AREA":
      return {
        titleLabel: "Area title",
        descriptionLabel: "Optional note",
        valueLabel: "Not used here",
        needsIcon: false,
        needsDescription: false,
        needsValue: false,
      }
    case "MODE":
      return {
        titleLabel: "Mode title",
        descriptionLabel: "Mode description",
        valueLabel: "Not used here",
        needsIcon: true,
        needsDescription: true,
        needsValue: false,
      }
    case "STEP":
      return {
        titleLabel: "Step content",
        descriptionLabel: "Optional detail",
        valueLabel: "Not used here",
        needsIcon: false,
        needsDescription: false,
        needsValue: false,
      }
    case "OUTCOME":
      return {
        titleLabel: "Outcome text",
        descriptionLabel: "Optional note",
        valueLabel: "Not used here",
        needsIcon: false,
        needsDescription: false,
        needsValue: false,
      }
    case "STAT":
      return {
        titleLabel: "Stat label",
        descriptionLabel: "Fallback value text",
        valueLabel: "Stat value",
        needsIcon: false,
        needsDescription: false,
        needsValue: true,
      }
  }
}

export default function AdminTrainingPage() {
  const router = useRouter()
  const [pageForm, setPageForm] = useState<TrainingPageContent>(emptyPageForm)
  const [items, setItems] = useState<TrainingItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState<ItemFormState>(emptyItemForm)
  const [filterSection, setFilterSection] = useState<TrainingSection | "ALL">("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [isPageSaving, setIsPageSaving] = useState(false)
  const [isItemSaving, setIsItemSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false)
  const [deleteLoadingOpen, setDeleteLoadingOpen] = useState(false)
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)

  const filteredItems = useMemo(
    () =>
      filterSection === "ALL"
        ? items
        : items.filter((item) => item.section === filterSection),
    [filterSection, items]
  )

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId]
  )

  const sectionMeta = getSectionMeta(itemForm.section)

  const loadTraining = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.get<ApiResponse<TrainingAdminResponse>>(
        "/training/admin"
      )
      const payload = response.data.data
      setPageForm({ ...emptyPageForm, ...payload.page })
      setItems(payload.items)
      setSelectedId((current) =>
        payload.items.some((item) => item.id === current)
          ? current
          : (payload.items[0]?.id ?? "")
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
    const timer = window.setTimeout(() => {
      void loadTraining()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadTraining])

  function updatePageField<K extends keyof TrainingPageContent>(
    key: K,
    value: TrainingPageContent[K]
  ) {
    setPageForm((current) => ({ ...current, [key]: value }))
  }

  function updateItemField<K extends keyof ItemFormState>(
    key: K,
    value: ItemFormState[K]
  ) {
    setItemForm((current) => ({ ...current, [key]: value }))
  }

  function startCreate() {
    setEditingId(null)
    setItemForm(emptyItemForm)
    setSuccess("")
    setError("")
  }

  function startEdit(item: TrainingItem) {
    setEditingId(item.id)
    setItemForm({
      section: item.section,
      title: item.title,
      description: item.description ?? "",
      iconKey: item.iconKey ?? "GraduationCap",
      value: item.value ?? "",
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })
    setSuccess("")
    setError("")
  }

  async function savePage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsPageSaving(true)

    try {
      await api.put("/training/page", pageForm)
      setSuccess("Training page content updated successfully.")
      await loadTraining()
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsPageSaving(false)
    }
  }

  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsItemSaving(true)
    setSaveLoadingOpen(true)

    const payload = {
      ...itemForm,
      description: itemForm.description.trim(),
      iconKey: itemForm.iconKey.trim(),
      value: itemForm.value.trim(),
    }

    try {
      if (editingId) {
        await api.put(`/training/items/${editingId}`, payload)
        setSuccess("Training item updated successfully.")
      } else {
        await api.post("/training/items", payload)
        setSuccess("Training item created successfully.")
      }
      await loadTraining()
      if (!editingId) {
        setItemForm(emptyItemForm)
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setSaveLoadingOpen(false)
      setIsItemSaving(false)
    }
  }

  async function deleteSelected() {
    if (!selected) return
    try {
      setError("")
      setSuccess("")
      setDeleteLoadingOpen(true)
      await api.delete(`/training/items/${selected.id}`)
      setDeleteLoadingOpen(false)
      setDeleteSuccessOpen(true)
      setSuccess("Training item deleted successfully.")
      if (editingId === selected.id) {
        setEditingId(null)
        setItemForm(emptyItemForm)
      }
      await loadTraining()
    } catch (deleteError) {
      setDeleteLoadingOpen(false)
      setError(getApiErrorMessage(deleteError))
    }
  }

  const PreviewIcon =
    (icons[itemForm.iconKey as keyof typeof icons] as typeof GraduationCap | undefined) ??
    Wrench

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
              <h1 className="text-2xl font-bold">Training Admin</h1>
              <p className="text-sm text-muted-foreground">
                Manage training page content and repeatable section items.
              </p>
            </div>
          </div>
          <Button className="rounded-lg" onClick={startCreate}>
            <Plus className="size-4" />
            New Item
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

        <section className="rounded-xl border border-border bg-card p-5 shadow-maritime-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Page Content</h2>
            <p className="text-sm text-muted-foreground">
              Update hero, headings, and call-to-action text without changing the page style.
            </p>
          </div>

          <form onSubmit={savePage} className="grid gap-4 lg:grid-cols-2">
            <Input
              required
              placeholder="Hero badge"
              value={pageForm.heroBadge}
              onChange={(e) => updatePageField("heroBadge", e.target.value)}
              className="border-input px-3"
            />
            <Input
              required
              placeholder="Snapshot eyebrow"
              value={pageForm.snapshotEyebrow}
              onChange={(e) => updatePageField("snapshotEyebrow", e.target.value)}
              className="border-input px-3"
            />
            <Input
              required
              placeholder="Hero title line 1"
              value={pageForm.heroTitleLine1}
              onChange={(e) => updatePageField("heroTitleLine1", e.target.value)}
              className="border-input px-3"
            />
            <Input
              required
              placeholder="Hero highlighted text"
              value={pageForm.heroTitleHighlight}
              onChange={(e) =>
                updatePageField("heroTitleHighlight", e.target.value)
              }
              className="border-input px-3"
            />
            <Textarea
              required
              placeholder="Hero description"
              value={pageForm.heroDescription}
              onChange={(e) => updatePageField("heroDescription", e.target.value)}
              className="min-h-28 border-input px-3 lg:col-span-2"
            />
            <Input
              required
              placeholder="Learning path title"
              value={pageForm.learningPathTitle}
              onChange={(e) =>
                updatePageField("learningPathTitle", e.target.value)
              }
              className="border-input px-3"
            />
            <Input
              required
              placeholder="Outcomes title"
              value={pageForm.outcomesTitle}
              onChange={(e) => updatePageField("outcomesTitle", e.target.value)}
              className="border-input px-3"
            />
            <Input
              required
              placeholder="CTA title"
              value={pageForm.ctaTitle}
              onChange={(e) => updatePageField("ctaTitle", e.target.value)}
              className="border-input px-3 lg:col-span-2"
            />
            <Textarea
              required
              placeholder="CTA description"
              value={pageForm.ctaDescription}
              onChange={(e) => updatePageField("ctaDescription", e.target.value)}
              className="min-h-24 border-input px-3 lg:col-span-2"
            />
            <Input
              required
              placeholder="Primary button text"
              value={pageForm.primaryButtonText}
              onChange={(e) =>
                updatePageField("primaryButtonText", e.target.value)
              }
              className="border-input px-3"
            />
            <Input
              required
              placeholder="Primary button link"
              value={pageForm.primaryButtonLink}
              onChange={(e) =>
                updatePageField("primaryButtonLink", e.target.value)
              }
              className="border-input px-3"
            />
            <Input
              required
              placeholder="Secondary button text"
              value={pageForm.secondaryButtonText}
              onChange={(e) =>
                updatePageField("secondaryButtonText", e.target.value)
              }
              className="border-input px-3"
            />
            <Input
              required
              placeholder="Secondary button link"
              value={pageForm.secondaryButtonLink}
              onChange={(e) =>
                updatePageField("secondaryButtonLink", e.target.value)
              }
              className="border-input px-3"
            />
            <label className="flex items-center gap-2 text-sm lg:col-span-2">
              <Checkbox
                checked={pageForm.isActive}
                onCheckedChange={(value) =>
                  updatePageField("isActive", value === true)
                }
              />
              Training page active
            </label>
            <Button
              type="submit"
              className="h-11 rounded-lg lg:col-span-2"
              disabled={isPageSaving}
            >
              {isPageSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Page Content
            </Button>
          </form>
        </section>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <section className="rounded-xl border border-border bg-card p-4 shadow-maritime-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-bold">Training Items</h2>
              <Select
                value={filterSection}
                onValueChange={(value) =>
                  setFilterSection(value as TrainingSection | "ALL")
                }
              >
                <SelectTrigger className="h-9 w-40 border-input">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Sections</SelectItem>
                  {sectionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  No training items yet.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${selectedId === item.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/40"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-semibold">{item.title}</p>
                      {!item.isActive && (
                        <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase text-amber-600">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sectionOptions.find((option) => option.value === item.section)?.label}
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
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            )}

            <form onSubmit={saveItem} className="space-y-4">
              <Select
                value={itemForm.section}
                onValueChange={(value) =>
                  updateItemField("section", value as TrainingSection)
                }
              >
                <SelectTrigger className="border-input">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                required
                placeholder={sectionMeta.titleLabel}
                value={itemForm.title}
                onChange={(e) => updateItemField("title", e.target.value)}
                className="border-input px-3"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="Sort order"
                  value={itemForm.sortOrder}
                  onChange={(e) =>
                    updateItemField("sortOrder", Number(e.target.value) || 0)
                  }
                  className="border-input px-3"
                />
                {sectionMeta.needsIcon ? (
                  <Select
                    value={itemForm.iconKey}
                    onValueChange={(value) =>
                      updateItemField("iconKey", value ?? "GraduationCap")
                    }
                  >
                    <SelectTrigger className="border-input">
                      <SelectValue placeholder="Icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((iconName) => (
                        <SelectItem key={iconName} value={iconName}>
                          {iconName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={sectionOptions.find((option) => option.value === itemForm.section)?.label ?? ""}
                    disabled
                    className="border-input px-3"
                  />
                )}
              </div>

              {(sectionMeta.needsDescription || itemForm.description.length > 0) && (
                <Textarea
                  placeholder={sectionMeta.descriptionLabel}
                  value={itemForm.description}
                  onChange={(e) =>
                    updateItemField("description", e.target.value)
                  }
                  className="min-h-24 border-input px-3"
                />
              )}

              {sectionMeta.needsValue && (
                <Input
                  placeholder={sectionMeta.valueLabel}
                  value={itemForm.value}
                  onChange={(e) => updateItemField("value", e.target.value)}
                  className="border-input px-3"
                />
              )}

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={itemForm.isActive}
                  onCheckedChange={(value) =>
                    updateItemField("isActive", value === true)
                  }
                />
                Active
              </label>

              <Button
                type="submit"
                className="h-11 w-full rounded-lg"
                disabled={isItemSaving}
              >
                {isItemSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editingId ? (
                  <Save className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                {editingId ? "Update Item" : "Create Item"}
              </Button>
            </form>

            <div className="rounded-lg border border-border/70 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Preview
              </p>
              {itemForm.section === "MODE" ? (
                <>
                  <div className="mb-2 inline-flex rounded-md bg-muted p-2">
                    <PreviewIcon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{itemForm.title || "Mode title"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {itemForm.description || "Mode description"}
                  </p>
                </>
              ) : itemForm.section === "STAT" ? (
                <>
                  <p className="text-2xl font-bold">{itemForm.value || "05+"}</p>
                  <p className="text-sm text-muted-foreground">
                    {itemForm.title || "Stat label"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {itemForm.title || "Section item preview"}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <DynamicModal
        isOpen={saveLoadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Saving..."
        description="Please wait while we save the training item."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        type="warning"
        title="Delete Training Item?"
        description="This will permanently remove the selected training item."
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
        description="Please wait while we remove the training item."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
        type="success"
        title="Deleted"
        description="Training item removed successfully."
        actionText="Continue"
      />
    </main>
  )
}
