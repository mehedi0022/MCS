"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Edit3, ImagePlus, Loader2, Plus, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { cn } from "@/lib/utils"

type HeroSlide = {
  id: string
  badgeText: string
  title: string
  subtitle: string
  imageUrl: string
  primaryButtonText?: string | null
  primaryButtonLink?: string | null
  secondaryButtonText?: string | null
  secondaryButtonLink?: string | null
  sortOrder: number
  isActive: boolean
}

type HeroSlideForm = {
  badgeText: string
  title: string
  subtitle: string
  imageUrl: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  sortOrder: string
  isActive: boolean
  file: File | null
}

const emptyForm: HeroSlideForm = {
  badgeText: "",
  title: "",
  subtitle: "",
  imageUrl: "",
  primaryButtonText: "",
  primaryButtonLink: "",
  secondaryButtonText: "",
  secondaryButtonLink: "",
  sortOrder: "0",
  isActive: true,
  file: null,
}

export function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [form, setForm] = useState<HeroSlideForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const previewImage = useMemo(() => {
    if (form.file) {
      return URL.createObjectURL(form.file)
    }

    return form.imageUrl
  }, [form.file, form.imageUrl])

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  useEffect(() => {
    loadSlides()
  }, [])

  async function loadSlides() {
    try {
      setIsLoading(true)
      const response =
        await api.get<ApiResponse<HeroSlide[]>>("/hero-slides/admin")
      setSlides(response.data.data)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  function updateField<K extends keyof HeroSlideForm>(
    key: K,
    value: HeroSlideForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function startEdit(slide: HeroSlide) {
    setEditingId(slide.id)
    setError("")
    setForm({
      badgeText: slide.badgeText,
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      primaryButtonText: slide.primaryButtonText ?? "",
      primaryButtonLink: slide.primaryButtonLink ?? "",
      secondaryButtonText: slide.secondaryButtonText ?? "",
      secondaryButtonLink: slide.secondaryButtonLink ?? "",
      sortOrder: String(slide.sortOrder),
      isActive: slide.isActive,
      file: null,
    })
  }

  function resetForm() {
    setEditingId(null)
    setError("")
    setForm(emptyForm)
  }

  function toFormData() {
    const formData = new FormData()

    formData.append("badgeText", form.badgeText)
    formData.append("title", form.title)
    formData.append("subtitle", form.subtitle)
    formData.append("sortOrder", form.sortOrder)
    formData.append("isActive", String(form.isActive))

    if (form.imageUrl) {
      formData.append("imageUrl", form.imageUrl)
    }

    if (form.primaryButtonText) {
      formData.append("primaryButtonText", form.primaryButtonText)
    }

    if (form.primaryButtonLink) {
      formData.append("primaryButtonLink", form.primaryButtonLink)
    }

    if (form.secondaryButtonText) {
      formData.append("secondaryButtonText", form.secondaryButtonText)
    }

    if (form.secondaryButtonLink) {
      formData.append("secondaryButtonLink", form.secondaryButtonLink)
    }

    if (form.file) {
      formData.append("file", form.file)
    }

    return formData
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSaving(true)

    try {
      if (editingId) {
        await api.put(`/hero-slides/${editingId}`, toFormData(), {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await api.post("/hero-slides", toFormData(), {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      resetForm()
      await loadSlides()
    } catch (saveError) {
      setError(getApiErrorMessage(saveError))
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteSlide(id: string) {
    const shouldDelete = window.confirm("Delete this hero slide?")

    if (!shouldDelete) {
      return
    }

    try {
      await api.delete(`/hero-slides/${id}`)
      await loadSlides()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError))
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-border bg-card p-5 shadow-maritime-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Hero Slides</h2>
            <p className="text-sm text-muted-foreground">
              Create and update the homepage hero carousel.
            </p>
          </div>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={resetForm}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {error && (
          <div className="border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            required
            placeholder="Badge text"
            value={form.badgeText}
            onChange={(event) => updateField("badgeText", event.target.value)}
            className="border-input px-3"
          />
          <Input
            required
            type="number"
            placeholder="Sort order"
            value={form.sortOrder}
            onChange={(event) => updateField("sortOrder", event.target.value)}
            className="border-input px-3"
          />
        </div>

        <Input
          required
          placeholder="Hero title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          className="border-input px-3"
        />

        <Textarea
          required
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(event) => updateField("subtitle", event.target.value)}
          className="min-h-24 border-input px-3"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Primary button text"
            value={form.primaryButtonText}
            onChange={(event) =>
              updateField("primaryButtonText", event.target.value)
            }
            className="border-input px-3"
          />
          <Input
            placeholder="Primary button link"
            value={form.primaryButtonLink}
            onChange={(event) =>
              updateField("primaryButtonLink", event.target.value)
            }
            className="border-input px-3"
          />
          <Input
            placeholder="Secondary button text"
            value={form.secondaryButtonText}
            onChange={(event) =>
              updateField("secondaryButtonText", event.target.value)
            }
            className="border-input px-3"
          />
          <Input
            placeholder="Secondary button link"
            value={form.secondaryButtonLink}
            onChange={(event) =>
              updateField("secondaryButtonLink", event.target.value)
            }
            className="border-input px-3"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            placeholder="Image URL or /hero1.png"
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className="border-input px-3"
          />
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-border px-4 text-xs font-bold uppercase tracking-widest hover:bg-muted">
            <ImagePlus className="size-4" />
            Upload
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) =>
                updateField("file", event.target.files?.[0] ?? null)
              }
            />
          </label>
        </div>

        {previewImage && (
          <div
            className="h-36 border border-border bg-cover bg-center"
            style={{ backgroundImage: `url(${previewImage})` }}
          />
        )}

        <div className="flex items-center gap-3">
          <Checkbox
            id="hero-active"
            checked={form.isActive}
            onCheckedChange={(value) => updateField("isActive", value === true)}
          />
          <label
            htmlFor="hero-active"
            className="cursor-pointer text-sm font-semibold text-muted-foreground"
          >
            Active on homepage
          </label>
        </div>

        <Button disabled={isSaving} className="h-11 w-full gap-2 rounded-none">
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : editingId ? (
            <Save className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {editingId ? "Update Slide" : "Create Slide"}
        </Button>
      </form>

      <div className="border border-border bg-card p-5 shadow-maritime-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Current Slides</h2>
            <p className="text-sm text-muted-foreground">
              Ordered by sort value, then newest.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={loadSlides}
          >
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex h-44 items-center justify-center border border-border">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : slides.length === 0 ? (
            <div className="flex h-44 items-center justify-center border border-border text-sm text-muted-foreground">
              No hero slides yet.
            </div>
          ) : (
            slides.map((slide) => (
              <article
                key={slide.id}
                className="grid gap-4 border border-border/70 p-3 md:grid-cols-[140px_1fr_auto]"
              >
                <div
                  className="h-28 bg-muted bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="bg-muted px-2 py-1 text-xs font-bold">
                      #{slide.sortOrder}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-bold",
                        slide.isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {slide.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {slide.badgeText}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-lg font-bold">
                    {slide.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {slide.subtitle}
                  </p>
                </div>
                <div className="flex items-start gap-2 md:flex-col">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => startEdit(slide)}
                  >
                    <Edit3 className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => deleteSlide(slide.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
