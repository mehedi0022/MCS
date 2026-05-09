import type { UploadApiResponse } from "cloudinary"
import { env } from "../config/env.js"
import { cloudinary } from "../config/cloudinary.js"
import { ApiError } from "../utils/api.js"

export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder = env.CLOUDINARY_FOLDER
) {
  if (
    !env.CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET
  ) {
    throw new ApiError(500, "Cloudinary environment variables are missing")
  }

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"))
          return
        }

        resolve(result)
      }
    )

    stream.end(file.buffer)
  })
}
