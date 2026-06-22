"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import { Crop, Loader2, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import "react-easy-crop/react-easy-crop.css"

export type OutputMimeType = "image/webp" | "image/jpeg" | "image/png"

export type ImageCropperDialogProps = {
  open: boolean
  file: File | null
  outputWidth: number
  outputHeight: number
  onOpenChange: (open: boolean) => void
  onCroppedFile: (file: File) => void
  title?: string
  description?: string
  applyText?: string
  fileNamePrefix?: string
  aspect?: number
  minZoom?: number
  maxZoom?: number
  outputType?: OutputMimeType
  outputQuality?: number
  cropShape?: "rect" | "round"
  showGrid?: boolean
  initialZoom?: number
  restrictPosition?: boolean
  roundCropAreaPixels?: boolean
  closeOnApply?: boolean
}

const outputExtensions: Record<OutputMimeType, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "Could not crop the selected image."
}

function loadCropImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not load selected image."))
    image.src = source
  })
}

function createImageBlob(
  canvas: HTMLCanvasElement,
  outputType: OutputMimeType,
  outputQuality: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error("Could not create cropped image."))
      },
      outputType,
      outputQuality
    )
  })
}

async function createCroppedImageFile({
  imageSource,
  cropPixels,
  fileName,
  fileNamePrefix,
  outputWidth,
  outputHeight,
  outputType,
  outputQuality,
}: {
  imageSource: string
  cropPixels: Area
  fileName: string
  fileNamePrefix?: string
  outputWidth: number
  outputHeight: number
  outputType: OutputMimeType
  outputQuality: number
}) {
  const image = await loadCropImage(imageSource)
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Could not prepare image crop.")
  }

  canvas.width = outputWidth
  canvas.height = outputHeight
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputWidth,
    outputHeight
  )

  const blob = await createImageBlob(canvas, outputType, outputQuality)
  const baseName = fileNamePrefix || fileName.replace(/\.[^.]+$/, "") || "image"
  const extension = outputExtensions[outputType]

  return new File(
    [blob],
    `${baseName}-${outputWidth}x${outputHeight}.${extension}`,
    { type: outputType }
  )
}

export function ImageCropperDialog({
  open,
  file,
  outputWidth,
  outputHeight,
  onOpenChange,
  onCroppedFile,
  title = "Crop Image",
  description,
  applyText = "Use Cropped Image",
  fileNamePrefix,
  aspect,
  minZoom = 1,
  maxZoom = 3,
  outputType = "image/webp",
  outputQuality = 0.9,
  cropShape = "rect",
  showGrid = true,
  initialZoom,
  restrictPosition = true,
  roundCropAreaPixels = true,
  closeOnApply = true,
}: ImageCropperDialogProps) {
  const startingZoom = initialZoom ?? minZoom
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(startingZoom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const cropAspect = aspect ?? outputWidth / outputHeight
  const outputSizeLabel = useMemo(
    () => `${outputWidth} x ${outputHeight}px`,
    [outputHeight, outputWidth]
  )
  const imageSource = useMemo(() => {
    if (!open || !file) {
      return ""
    }

    return URL.createObjectURL(file)
  }, [file, open])
  const dialogDescription =
    description ?? `Output size: ${outputSizeLabel}. Adjust the visible area before applying.`

  useEffect(() => {
    return () => {
      if (imageSource) {
        URL.revokeObjectURL(imageSource)
      }
    }
  }, [imageSource])

  const handleCropComplete = useCallback(
    (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(nextCroppedAreaPixels)
    },
    []
  )

  function resetCropState() {
    setCrop({ x: 0, y: 0 })
    setZoom(startingZoom)
    setCroppedAreaPixels(null)
    setError("")
  }

  function closeDialog() {
    if (isProcessing) {
      return
    }

    resetCropState()
    onOpenChange(false)
  }

  async function applyCrop() {
    if (!file || !imageSource || !croppedAreaPixels) {
      setError("Select the visible area before applying the image.")
      return
    }

    try {
      setIsProcessing(true)
      setError("")

      const croppedFile = await createCroppedImageFile({
        imageSource,
        cropPixels: croppedAreaPixels,
        fileName: file.name,
        fileNamePrefix,
        outputWidth,
        outputHeight,
        outputType,
        outputQuality,
      })

      onCroppedFile(croppedFile)
      resetCropState()
      if (closeOnApply) {
        onOpenChange(false)
      }
    } catch (cropError) {
      setError(getErrorMessage(cropError))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeDialog()
          return
        }

        onOpenChange(true)
      }}
    >
      <DialogContent
        className="max-w-4xl gap-0 overflow-hidden p-0 data-closed:zoom-out-100 data-open:zoom-in-100"
        showCloseButton={!isProcessing}
      >
        <DialogHeader className="border-b border-border p-5 pr-16">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-5">
          <div className="relative h-72 overflow-hidden rounded-lg bg-maritime-abyss sm:h-96">
            {imageSource && (
              <Cropper
                image={imageSource}
                crop={crop}
                zoom={zoom}
                aspect={cropAspect}
                minZoom={minZoom}
                maxZoom={maxZoom}
                cropShape={cropShape}
                showGrid={showGrid}
                objectFit="contain"
                roundCropAreaPixels={roundCropAreaPixels}
                restrictPosition={restrictPosition}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropAreaChange={handleCropComplete}
                onCropComplete={handleCropComplete}
              />
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <label className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Zoom
              </span>
              <input
                type="range"
                min={minZoom}
                max={maxZoom}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="h-2 w-full accent-primary"
              />
            </label>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg"
              disabled={isProcessing}
              onClick={() => {
                setCrop({ x: 0, y: 0 })
                setZoom(startingZoom)
              }}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border p-5">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            disabled={isProcessing}
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="gap-2 rounded-lg"
            disabled={isProcessing}
            onClick={applyCrop}
          >
            {isProcessing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Crop className="size-4" />
            )}
            {applyText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
