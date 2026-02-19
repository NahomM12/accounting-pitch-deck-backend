"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Trash2, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadThumbnail, deleteThumbnail } from "@/lib/api"
import { toast } from "sonner"

export default function ThumbnailManagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleUpload() {
    if (!file) {
      toast.error("Please select an image file")
      return
    }
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("thumbnail", file)
      await uploadThumbnail(Number(id), formData)
      toast.success("Thumbnail uploaded successfully!")
      router.push("/dashboard/admin/pitch-decks")
    } catch {
      toast.error("Failed to upload thumbnail")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteThumbnail(Number(id))
      toast.success("Thumbnail deleted successfully!")
      router.push("/dashboard/admin/pitch-decks")
    } catch {
      toast.error("Failed to delete thumbnail")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard/admin/pitch-decks">
          <ArrowLeft className="mr-1 size-4" />
          Back to Pitch Decks
        </Link>
      </Button>

      <h1 className="font-serif text-2xl font-extrabold text-foreground">
        Manage Thumbnail
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload or replace the thumbnail for pitch deck #{id}
      </p>

      <div className="mt-8 max-w-xl rounded-xl border bg-card p-6">
        <h2 className="font-serif text-lg font-bold text-card-foreground">
          Upload New Thumbnail
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Supported formats: JPEG, PNG, GIF, SVG, BMP (max 5MB). Will be
          converted to WebP.
        </p>

        <div className="mt-4">
          {file ? (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
              <img
                src={URL.createObjectURL(file)}
                alt="Thumbnail preview"
                className="size-16 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setFile(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/50">
              <ImageIcon className="size-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload an image
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/bmp"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex-1 font-serif font-semibold"
          >
            <Upload className="mr-1 size-4" />
            {isUploading ? "Uploading..." : "Upload Thumbnail"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-1 size-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
