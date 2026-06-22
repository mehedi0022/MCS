"use client"

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react"
import { icons } from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
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

type DeliveryApproachSection = {
  id: string
  eyebrow: string
  title: string
  isActive: boolean
}

type DeliveryApproachStep = {
  id: string
  title: string
  description: string
  iconKey: string
  sortOrder: number
  isActive: boolean
}

type DeliveryApproachPayload = {
  section: DeliveryApproachSection
  steps: DeliveryApproachStep[]
}

type SectionFormState = {
  eyebrow: string
  title: string
  isActive: boolean
}

type StepFormState = {
  title: string
  description: string
  iconKey: string
  sortOrder: number
  isActive: boolean
}

const emptySectionForm: SectionFormState = {
  eyebrow: "Our Delivery Approach",
  title: "Accurate. Actionable. Sustainable.",
  isActive: true,
}

const emptyStepForm: StepFormState = {
  title: "",
  description: "",
  iconKey: "Search",
  sortOrder: 0,
  isActive: true,
}

const iconOptions = [
  "Search",
  "PenTool",
  "Activity",
  "ShieldCheck",
  "Anchor",
  "ShipWheel",
  "Navigation",
  "Compass",
  "Map",
  "MapPinned",
  "Waves",
  "Radar",
  "Route",
  "Globe",
  "HardHat",
  "DraftingCompass",
  "Gauge",
  "Cog",
  "Wrench",
  "ClipboardCheck",
  "FileCheck2",
  "CheckCircle2",
  "BadgeCheck",
  "Satellite",
  "Database",
  "Workflow",
  "Layers3",
  "SearchCheck",
  "Microscope",
] as const

export function DeliveryApproachManager() {
  const router = useRouter()
  const [sectionForm, setSectionForm] =
    useState<SectionFormState>(emptySectionForm)
  const [steps, setSteps] = useState<DeliveryApproachStep[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stepForm, setStepForm] = useState<StepFormState>(emptyStepForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false)
  const [deleteLoadingOpen, setDeleteLoadingOpen] = useState(false)
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)

  const selected = useMemo(
    () => steps.find((item) => item.id === selectedId),
    [steps, selectedId]
  )

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const response =
        await api.get<ApiResponse<DeliveryApproachPayload>>(
          "/delivery-approach/admin"
        )
      const payload = response.data.data

      setSectionForm({
        eyebrow: payload.section.eyebrow,
        title: payload.section.title,
        isActive: payload.section.isActive,
      })
      setSteps(payload.steps)
      setSelectedId((current) =>
        payload.steps.some((item) => item.id === current)
          ? current
          : (payload.steps[0]?.id ?? "")
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
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  function updateSectionField<K extends keyof SectionFormState>(
    key: K,
    value: SectionFormState[K]
  ) {
    setSectionForm((current) => ({ ...current, [key]: value }))
  }

  function updateStepField<K extends keyof StepFormState>(
    key: K,
    value: StepFormState[K]
  ) {
    setStepForm((current) => ({ ...current, [key]: value }))
  }

  function startCreate() {
    setEditingId(null)
    setStepForm(emptyStepForm)
    setSuccess("")
    setError("")
  }

  function startEdit(item: DeliveryApproachStep) {
    setEditingId(item.id)
    setStepForm({
      title: item.title,
      description: item.description,
      iconKey: item.iconKey,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })
    setSuccess("")
    setError("")
  }

  async function submitSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)
    setSaveLoadingOpen(true)

    try {
      await api.put("/delivery-approach/section", sectionForm)
      setSuccess("Delivery approach heading updated successfully.")
      await loadData()
    } catch (submitError) {
      setSaveLoadingOpen(false)
      setError(getApiErrorMessage(submitError))
    } finally {
      setSaveLoadingOpen(false)
      setIsSaving(false)
    }
  }

  async function submitStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)
    setSaveLoadingOpen(true)

    try {
      if (editingId) {
        await api.put(`/delivery-approach/steps/${editingId}`, stepForm)
        setSuccess("Delivery approach step updated successfully.")
      } else {
        await api.post("/delivery-approach/steps", stepForm)
        setSuccess("Delivery approach step created successfully.")
      }

      await loadData()
      if (!editingId) {
        setStepForm(emptyStepForm)
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
      setDeleteLoadingOpen(true)
      await api.delete(`/delivery-approach/steps/${selected.id}`)
      setDeleteLoadingOpen(false)
      setDeleteSuccessOpen(true)
      setSuccess("Delivery approach step deleted successfully.")
      if (editingId === selected.id) {
        setEditingId(null)
        setStepForm(emptyStepForm)
      }
      await loadData()
    } catch (deleteError) {
      setDeleteLoadingOpen(false)
      setError(getApiErrorMessage(deleteError))
    } finally {
      setIsSaving(false)
    }
  }

  const PreviewIcon = (icons[stepForm.iconKey as keyof typeof icons] ??
    Search) as typeof Search

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-maritime-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-[0.18em] text-primary uppercase">
            <Activity className="size-3.5" />
            Services page section
          </div>
          <h2 className="text-2xl font-bold">Our Delivery Approach</h2>
          <p className="text-sm text-muted-foreground">
            Manage the approach heading and the timeline steps shown on the
            Services page.
          </p>
        </div>
        <Button type="button" className="rounded-lg" onClick={startCreate}>
          <Plus className="size-4" />
          New Step
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

      <form
        onSubmit={submitSection}
        className="grid gap-3 rounded-lg border border-border/70 p-4 md:grid-cols-[1fr_1.4fr_auto]"
      >
        <Input
          required
          placeholder="Section label"
          value={sectionForm.eyebrow}
          onChange={(event) =>
            updateSectionField("eyebrow", event.target.value)
          }
          className="border-input px-3"
        />
        <Input
          required
          placeholder="Section headline"
          value={sectionForm.title}
          onChange={(event) => updateSectionField("title", event.target.value)}
          className="border-input px-3"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={sectionForm.isActive}
              onCheckedChange={(value) =>
                updateSectionField("isActive", value === true)
              }
            />
            Active
          </label>
          <Button type="submit" className="h-11 rounded-lg" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
          </Button>
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-lg border border-border/70 p-4">
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            ) : steps.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No delivery approach steps yet.
              </div>
            ) : (
              steps.map((item, index) => {
                const StepIcon = (icons[item.iconKey as keyof typeof icons] ??
                  Search) as typeof Search

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${selectedId === item.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/40"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                        <StepIcon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="line-clamp-1 font-semibold">
                            {String(index + 1).padStart(2, "0")}. {item.title}
                          </p>
                          {!item.isActive && (
                            <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-600 uppercase">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Sort: {item.sortOrder}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-border/70 p-4">
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

          <form onSubmit={submitStep} className="space-y-4">
            <Input
              required
              placeholder="Step title"
              value={stepForm.title}
              onChange={(event) =>
                updateStepField("title", event.target.value)
              }
              className="border-input px-3"
            />

            <Textarea
              required
              placeholder="Step description"
              value={stepForm.description}
              onChange={(event) =>
                updateStepField("description", event.target.value)
              }
              className="min-h-24 border-input px-3"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <Select
                value={stepForm.iconKey}
                onValueChange={(value) =>
                  updateStepField("iconKey", value ?? "Search")
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

              <Input
                type="number"
                min={0}
                placeholder="Sort Order"
                value={stepForm.sortOrder}
                onChange={(event) =>
                  updateStepField(
                    "sortOrder",
                    Number(event.target.value) || 0
                  )
                }
                className="border-input px-3"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={stepForm.isActive}
                onCheckedChange={(value) =>
                  updateStepField("isActive", value === true)
                }
              />
              Active on Services page
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
              {editingId ? "Update Step" : "Create Step"}
            </Button>
          </form>

          <div className="rounded-lg border border-border/70 p-4">
            <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Preview
            </p>
            <div className="mb-2 inline-flex rounded-md bg-muted p-2">
              <PreviewIcon className="size-5 text-primary" />
            </div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">
              {sectionForm.eyebrow || "Our Delivery Approach"}
            </p>
            <h3 className="mt-2 font-semibold">
              {stepForm.title || "Step title"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {stepForm.description || "Step description preview"}
            </p>
          </div>
        </section>
      </div>

      <DynamicModal
        isOpen={saveLoadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Saving..."
        description="Please wait while we save the delivery approach content."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        type="warning"
        title="Delete Step?"
        description="This will permanently remove the selected delivery approach step."
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
        description="Please wait while we remove the delivery approach step."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
        type="success"
        title="Deleted"
        description="Delivery approach step removed successfully."
        actionText="Continue"
      />
    </section>
  )
}
