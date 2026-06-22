"use client"

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DynamicModal } from "@/components/DynamicModal"
import { ImageCropperDialog } from "@/components/shared/ImageCropperDialog"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

type GalleryImage = {
  url: string
  publicId: string
}

type ProjectItem = {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  description?: string | null
  client?: string | null
  location?: string | null
  year?: number | null
  imageUrl?: string | null
  imagePublicId?: string | null
  gallery?: GalleryImage[]
  isPublished: boolean
  isFeatured: boolean
}

type ProjectFormState = {
  title: string
  category: string
  summary: string
  description: string
  client: string
  location: string
  year: string
  isPublished: boolean
  isFeatured: boolean
  imageUrl: string
}

const emptyForm: ProjectFormState = {
  title: "",
  category: "",
  summary: "",
  description: "",
  client: "",
  location: "",
  year: "",
  isPublished: true,
  isFeatured: false,
  imageUrl: "",
}

type ProjectCropTarget = "cover" | "gallery"

const PROJECT_IMAGE_WIDTH = 1920
const PROJECT_IMAGE_HEIGHT = 1080
const PROJECT_IMAGE_ASPECT = PROJECT_IMAGE_WIDTH / PROJECT_IMAGE_HEIGHT
const PROJECT_IMAGE_SIZE_LABEL = `${PROJECT_IMAGE_WIDTH} x ${PROJECT_IMAGE_HEIGHT}px`

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjectFormState>(emptyForm)
  const [retainedGallery, setRetainedGallery] = useState<GalleryImage[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropTarget, setCropTarget] = useState<ProjectCropTarget | null>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [galleryCropQueue, setGalleryCropQueue] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [saveLoadingOpen, setSaveLoadingOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteLoadingOpen, setDeleteLoadingOpen] = useState(false)
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)

  const selected = useMemo(
    () => projects.find((project) => project.id === selectedId),
    [projects, selectedId]
  )

  const coverPreviewUrl = useMemo(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile)
    }
    return form.imageUrl || ""
  }, [coverFile, form.imageUrl])

  const galleryPreviewUrls = useMemo(
    () => galleryFiles.map((file) => URL.createObjectURL(file)),
    [galleryFiles]
  )

  useEffect(() => {
    return () => {
      if (coverPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl)
      }
      galleryPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [coverPreviewUrl, galleryPreviewUrls])

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.get<ApiResponse<ProjectItem[]>>("/projects", {
        params: { view: "admin" },
      })
      const rows = response.data.data.map((item) => ({
        ...item,
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
      }))
      setProjects(rows)
      setSelectedId((current) =>
        rows.some((item) => item.id === current) ? current : (rows[0]?.id ?? "")
      )
    } catch (loadError) {
      const message = getApiErrorMessage(loadError)
      if (message.toLowerCase().includes("auth")) {
        router.replace("/login")
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (!deleteSuccessOpen) {
      return
    }

    const timer = window.setTimeout(() => {
      setDeleteSuccessOpen(false)
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [deleteSuccessOpen])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjects()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadProjects])

  function updateField<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function openCropper(file: File, target: ProjectCropTarget) {
    setCropFile(file)
    setCropTarget(target)
    setCropOpen(true)
  }

  function clearCropper() {
    setCropOpen(false)
    setCropFile(null)
    setCropTarget(null)
    setGalleryCropQueue([])
  }

  function handleCoverImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""

    if (!file) {
      return
    }

    openCropper(file, "cover")
  }

  function handleGalleryImagesSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""

    if (files.length === 0) {
      return
    }

    const [firstFile, ...remainingFiles] = files

    setGalleryCropQueue(remainingFiles)
    openCropper(firstFile, "gallery")
  }

  function handleCropOpenChange(open: boolean) {
    setCropOpen(open)

    if (!open) {
      setCropFile(null)
      setCropTarget(null)
      setGalleryCropQueue([])
    }
  }

  function handleCroppedProjectImage(file: File) {
    if (cropTarget === "cover") {
      setCoverFile(file)
      clearCropper()
      return
    }

    setGalleryFiles((current) => [...current, file])

    const [nextFile, ...remainingFiles] = galleryCropQueue

    if (nextFile) {
      setGalleryCropQueue(remainingFiles)
      openCropper(nextFile, "gallery")
      return
    }

    clearCropper()
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setRetainedGallery([])
    setCoverFile(null)
    setGalleryFiles([])
    clearCropper()
  }

  function startEdit(project: ProjectItem) {
    setEditingId(project.id)
    setForm({
      title: project.title,
      category: project.category,
      summary: project.summary ?? "",
      description: project.description ?? "",
      client: project.client ?? "",
      location: project.location ?? "",
      year: project.year?.toString() ?? "",
      isPublished: project.isPublished,
      isFeatured: project.isFeatured,
      imageUrl: project.imageUrl ?? "",
    })
    setRetainedGallery(project.gallery ?? [])
    setCoverFile(null)
    setGalleryFiles([])
    clearCropper()
  }

  function removeRetainedGallery(publicId: string) {
    setRetainedGallery((current) =>
      current.filter((item) => item.publicId !== publicId)
    )
  }

  function formDataFromState() {
    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("category", form.category)
    formData.append("summary", form.summary)
    formData.append("description", form.description)
    formData.append("client", form.client)
    formData.append("location", form.location)
    formData.append("year", form.year)
    formData.append("isPublished", String(form.isPublished))
    formData.append("isFeatured", String(form.isFeatured))
    formData.append("imageUrl", form.imageUrl)
    formData.append("gallery", JSON.stringify(retainedGallery))

    if (coverFile) {
      formData.append("coverImage", coverFile)
    }

    galleryFiles.forEach((file) => {
      formData.append("galleryImages", file)
    })

    return formData
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError("")
    setSaveLoadingOpen(true)

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, formDataFromState(), {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await api.post("/projects", formDataFromState(), {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      startCreate()
      await loadProjects()
    } catch (submitError) {
      setSaveLoadingOpen(false)
      setError(getApiErrorMessage(submitError))
    } finally {
      setSaveLoadingOpen(false)
      setIsSaving(false)
    }
  }

  async function moveToTrash() {
    if (!selected) return
    try {
      setIsSaving(true)
      setDeleteLoadingOpen(true)
      await api.delete(`/projects/${selected.id}`)
      await loadProjects()
      setDeleteLoadingOpen(false)
      setDeleteSuccessOpen(true)
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
              <h1 className="text-2xl font-bold">Projects Admin</h1>
              <p className="text-sm text-muted-foreground">
                Manage title, description, cover image, and gallery images.
              </p>
            </div>
          </div>
          <Button className="rounded-lg" onClick={startCreate}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="shadow-maritime-sm rounded-xl border border-border bg-card p-4">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : projects.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  No projects yet.
                </div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedId(project.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${selectedId === project.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/40"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-semibold">
                        {project.title}
                      </p>
                      {!project.isPublished && (
                        <span className="rounded-md px-2 py-1 text-[10px] font-bold text-amber-600 uppercase">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {project.category}
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
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => startEdit(selected)}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-lg"
                  onClick={() => setDeleteModalOpen(true)}
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
                  placeholder="Project title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="border-input px-3"
                />
                <Input
                  required
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
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

              <div className="space-y-2">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Project Description
                </p>
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => updateField("description", value)}
                  placeholder="Write formatted project details..."
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="border-input px-3"
                />
                <Input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="border-input px-3"
                />
                <Input
                  placeholder="Client"
                  value={form.client}
                  onChange={(e) => updateField("client", e.target.value)}
                  className="border-input px-3"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-border px-4 text-xs font-bold tracking-widest uppercase hover:bg-muted">
                  <ImagePlus className="size-4" />
                  Upload Cover Image
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCoverImageSelect}
                  />
                </label>
                <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-border px-4 text-xs font-bold tracking-widest uppercase hover:bg-muted">
                  <ImagePlus className="size-4" />
                  Upload Slider Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleGalleryImagesSelect}
                  />
                </label>
              </div>

              <div className="grid gap-2 text-xs font-semibold text-muted-foreground md:grid-cols-2">
                <p>Cover recommended size: 1920 x 1080 px</p>
                <p>Slider image recommended size: 1920 x 1080 px</p>
              </div>

              {coverPreviewUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Cover Preview
                  </p>
                  <div className="relative h-48 overflow-hidden rounded-lg border border-border">
                    <Image
                      src={coverPreviewUrl}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      unoptimized={coverPreviewUrl.startsWith("blob:")}
                    />
                  </div>
                </div>
              )}

              {galleryPreviewUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    New Gallery Preview
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {galleryPreviewUrls.map((url) => (
                      <div
                        key={url}
                        className="relative h-24 overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={url}
                          alt="New gallery preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {retainedGallery.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Current Gallery
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {retainedGallery.map((image) => (
                      <div
                        key={image.publicId}
                        className="relative h-24 overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={image.url}
                          alt="Gallery item"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeRetainedGallery(image.publicId)}
                          className="absolute top-1 right-1 bg-black/70 p-1 text-white"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
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
                {editingId ? "Update Project" : "Create Project"}
              </Button>
            </form>
          </section>
        </div>
      </div>

      <ImageCropperDialog
        open={cropOpen}
        file={cropFile}
        title={
          cropTarget === "gallery"
            ? "Crop Project Slider Image"
            : "Crop Project Cover Image"
        }
        description={`Output size: ${PROJECT_IMAGE_SIZE_LABEL}. Use the crop box to choose the visible project image area.`}
        outputWidth={PROJECT_IMAGE_WIDTH}
        outputHeight={PROJECT_IMAGE_HEIGHT}
        aspect={PROJECT_IMAGE_ASPECT}
        fileNamePrefix={
          cropTarget === "gallery" ? "project-slider" : "project-cover"
        }
        closeOnApply={cropTarget !== "gallery"}
        onOpenChange={handleCropOpenChange}
        onCroppedFile={handleCroppedProjectImage}
      />

      <DynamicModal
        isOpen={saveLoadingOpen}
        onClose={() => {}}
        type="loading"
        title="Saving"
        description="Please wait while we save the project."
        actionText="Please Wait"
        onAction={() => {}}
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        type="warning"
        title="Delete Project?"
        description="This will remove the project and its Cloudinary images permanently."
        actionText={isSaving ? "Deleting..." : "Confirm Delete"}
        onAction={async () => {
          if (!selected || isSaving) return
          setDeleteModalOpen(false)
          await moveToTrash()
        }}
        showCloseButton={!isSaving}
      />

      <DynamicModal
        isOpen={deleteLoadingOpen}
        onClose={() => {}}
        type="loading"
        title="Deleting"
        description="Please wait while we remove the project and related assets."
        actionText="Please Wait"
        onAction={() => {}}
        showCloseButton={false}
      />

      <DynamicModal
        isOpen={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
        type="success"
        title="Deleted"
        description="Project deleted successfully."
        actionText="Continue"
      />
    </main>
  )
}





