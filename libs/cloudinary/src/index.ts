import { v2 as cloudinary } from "cloudinary";
import { Api } from "bknd/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const api = new Api({
  host: process.env.BKND_HOST ?? "http://localhost:1337",
  token: process.env.BKND_TOKEN!,
});

export type ImageRecord = {
  id: number;
  label: string;
  source_url: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type UploadImageOptions = {
  label: string;
  alt?: string;
  /** Cloudinary folder to upload into */
  folder?: string;
};

/**
 * Upload an image from any URL to Cloudinary, then create an image record
 * in bknd and return it.
 */
export async function uploadFromUrl(
  sourceUrl: string,
  options: UploadImageOptions,
): Promise<ImageRecord> {
  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder: options.folder,
    resource_type: "image",
  });

  const { data } = await api.data.createOne("images", {
    label: options.label,
    source_url: sourceUrl,
    cloudinary_url: result.secure_url,
    cloudinary_public_id: result.public_id,
    width: result.width,
    height: result.height,
    alt: options.alt,
  });

  return data as ImageRecord;
}

/**
 * Attach an existing image record to a video.
 */
export async function attachImageToVideo(
  imageId: number,
  videoId: number,
): Promise<void> {
  // uses bknd's relation endpoint: PATCH /api/data/videos/:id/images/:refId
  await fetch(
    `${process.env.BKND_HOST ?? "http://localhost:1337"}/api/data/videos/${videoId}/images/${imageId}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${process.env.BKND_TOKEN}` },
    }
  );
}
