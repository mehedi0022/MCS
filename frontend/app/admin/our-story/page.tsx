"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Loader2, Save } from "lucide-react"
import { DynamicModal } from "@/components/DynamicModal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"

type OurStoryItem = {
  id: "main"
  sinceLabel: string
  headingLine1: string
  headingLine2: string
  storyHtml: string
  badge: string
  title: string
  imageUrl: string
  imagePublicId?: string | null
  isActive: boolean
}

type FormState = {
  sinceLabel: string
  headingLine1: string
  headingLine2: string
  storyHtml: string
  badge: string
  title: string
  isActive: boolean
  file: File | null
}

const emptyForm: FormState = {
  sinceLabel: "Since 2014",
  headingLine1: "Built by the sea,",
  headingLine2: "for the sea.",
  storyHtml: "",
  badge: "Global Impact",
  title: "",
  isActive: true,
  file: null,
}

export default function AdminOurStoryPage() {
  const [item, setItem] = useState<OurStoryItem | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loadingOpen, setLoadingOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const previewImage = useMemo(() => {
    if (form.file) return URL.createObjectURL(form.file)
    return item?.imageUrl ?? ""
  }, [form.file, item?.imageUrl])

  useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  useEffect(() => {
    void loadItem()
  }, [])

  async function loadItem() {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.get<ApiResponse<OurStoryItem | null>>("/our-story/admin")
      const row = response.data.data
      setItem(row)
      if (row) {
        setForm({
          sinceLabel: row.sinceLabel,
          headingLine1: row.headingLine1,
          headingLine2: row.headingLine2,
          storyHtml: row.storyHtml,
          badge: row.badge,
          title: row.title,
          isActive: row.isActive,
          file: null,
        })
      } else {
        setForm(emptyForm)
      }
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function toFormData() {
    const formData = new FormData()
    formData.append("sinceLabel", form.sinceLabel)
    formData.append("headingLine1", form.headingLine1)
    formData.append("headingLine2", form.headingLine2)
    formData.append("storyHtml", form.storyHtml)
    formData.append("badge", form.badge)
    formData.append("title", form.title)
    formData.append("isActive", String(form.isActive))
    if (form.file) {
      formData.append("file", form.file)
    }
    return formData
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)
    setLoadingOpen(true)
    try {
      await api.put("/our-story", toFormData(), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setLoadingOpen(false)
      setSuccessOpen(true)
      setSuccess("Our Story updated successfully.")
      await loadItem()
      setForm((current) => ({ ...current, file: null }))
    } catch (submitError) {
      setLoadingOpen(false)
      setError(getApiErrorMessage(submitError))
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
              <h1 className="text-2xl font-bold">Our Story Admin</h1>
              <p className="text-sm text-muted-foreground">
                Update the single right-side card on About page.
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

        <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-maritime-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-lg border border-border/70 p-4">
                  <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    Left Content
                  </h3>
                  <Input
                    required
                    placeholder="Top label (e.g. Since 2014)"
                    value={form.sinceLabel}
                    onChange={(e) => updateField("sinceLabel", e.target.value)}
                    className="border-input px-3"
                  />

                  <div className="grid gap-3">
                    <Input
                      required
                      placeholder="Heading line 1"
                      value={form.headingLine1}
                      onChange={(e) => updateField("headingLine1", e.target.value)}
                      className="border-input px-3"
                    />
                    <Input
                      required
                      placeholder="Heading line 2 (italic line)"
                      value={form.headingLine2}
                      onChange={(e) => updateField("headingLine2", e.target.value)}
                      className="border-input px-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Story Body
                    </p>
                    <RichTextEditor
                      value={form.storyHtml}
                      onChange={(value) => updateField("storyHtml", value)}
                      placeholder="Write the full Our Story left-side content..."
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-border/70 p-4">
                  <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    Right Visual Card
                  </h3>
                  <Input
                    required
                    placeholder="Badge (e.g. Global Impact)"
                    value={form.badge}
                    onChange={(e) => updateField("badge", e.target.value)}
                    className="border-input px-3"
                  />

                  <Input
                    required
                    placeholder="Headline (e.g. 40+ Ports Optimized Worldwide)"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="border-input px-3"
                  />

                  <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-border px-4 text-xs font-bold uppercase tracking-widest hover:bg-muted">
                    <ImagePlus className="size-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => updateField("file", event.target.files?.[0] ?? null)}
                    />
                  </label>

                  {previewImage && (
                    <div
                      className="h-48 border border-border bg-cover bg-center"
                      style={{ backgroundImage: `url(${previewImage})` }}
                    />
                  )}

                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.isActive}
                      onCheckedChange={(value) => updateField("isActive", value === true)}
                    />
                    Active
                  </label>
                </div>
              </div>

              <Button type="submit" className="h-11 w-full rounded-lg" disabled={isSaving}>
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Our Story
              </Button>
            </form>
          )}
        </section>
      </div>

      <DynamicModal
        isOpen={loadingOpen}
        onClose={() => undefined}
        type="loading"
        title="Saving..."
        description="Please wait while we update the Our Story card."
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        type="success"
        title="Saved"
        description="Our Story card updated successfully."
        actionText="Continue"
      />
    </main>
  )
}



