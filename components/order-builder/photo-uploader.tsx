"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import { AlertTriangle, ImageOff, X } from "lucide-react";
import { toast } from "sonner";
import { MAX_CARD_PHOTOS } from "@/lib/site-config";
import { DocSprite, PixelIcon } from "@/components/pixel/sprites";

interface PhotoUploaderProps {
  photoUrls: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

// Compress image client-side to ≤ 2000px wide, JPEG 0.85.
// Keeps files small (< 1 MB typically) so uploads are fast and well under any size cap.
// Falls back to original file if canvas fails (e.g. unsupported format on some desktops).
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const MAX_PX = 2000;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > MAX_PX) {
        height = Math.round((height * MAX_PX) / width);
        width = MAX_PX;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // can't decode (e.g. HEIC on desktop) — send original
    };
    img.src = objectUrl;
  });
}

// The file's type, or a guess from its name when the browser gives none (many
// desktops don't know HEIC). The bucket only takes uploads declared as images.
function fileType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "heic" ? "image/heic" : ext === "heif" ? "image/heif" : "";
}

async function uploadFile(file: File): Promise<string> {
  // Compress first; if compression produces a tiny result, upload directly.
  const compressed = await compressImage(file);
  const contentType = fileType(compressed);

  // Try presigned direct-to-Supabase upload first (bypasses Netlify 6 MB body cap).
  // Fall back to regular server-side POST if presign fails.
  try {
    const presignRes = await fetch("/api/upload", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: compressed.name, contentType }),
    });
    if (presignRes.ok) {
      const { signedUrl, publicUrl } = await presignRes.json();
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: compressed,
      });
      if (uploadRes.ok) return publicUrl as string;
    }
  } catch {
    // fall through to server-side POST
  }

  // Server-side POST fallback (compressed file is typically < 500 KB, well under limits)
  const fd = new FormData();
  fd.append("file", compressed);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? `Upload failed (${res.status})`);
  }
  const data = await res.json();
  if (!data.url) throw new Error(data.error ?? "Upload failed");
  return data.url as string;
}

// The user agent never changes while the page is open
const noSubscribe = () => () => {};

export function PhotoUploader({ photoUrls, onChange, max = MAX_CARD_PHOTOS }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  // In-app browsers (Instagram, Facebook...) often can't pick photos; false on the server
  const isInAppBrowser = useSyncExternalStore(
    noSubscribe,
    () => /Instagram|FBAN|FBAV|FB_IAB|Twitter|TikTok/i.test(navigator.userAgent),
    () => false,
  );

  const processFiles = useCallback(async (rawFiles: File[]) => {
    setUploadError("");
    const remaining = max - photoUrls.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${max} photos per card.`);
      return;
    }
    const toUpload = rawFiles.filter((f) => !f.type || f.type.startsWith("image/")).slice(0, remaining);
    if (toUpload.length === 0) {
      const msg = "Please select image files (JPEG, PNG, HEIC, etc.)";
      setUploadError(msg);
      toast.error(msg);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];
    for (const file of toUpload) {
      try {
        const url = await uploadFile(file);
        newUrls.push(url);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
        setUploadError(msg);
        toast.error(msg);
      }
    }
    if (newUrls.length > 0) onChange([...photoUrls, ...newUrls]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }, [photoUrls, onChange, max]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    processFiles(Array.from(e.target.files ?? []));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (!uploading) processFiles(Array.from(e.dataTransfer.files));
  }

  function remove(url: string) {
    onChange(photoUrls.filter((u) => u !== url));
  }

  if (isInAppBrowser) {
    return (
      <div className="bg-rx-soft p-3 text-sm px-frame">
        <p className="mb-1 flex items-center gap-2 font-semibold text-destructive"><ImageOff className="h-4 w-4 shrink-0" strokeWidth={2} />Photo upload blocked</p>
        <p className="text-destructive leading-relaxed">
          Instagram&apos;s browser doesn&apos;t allow photo uploads.{" "}
          <strong>Tap ··· → &quot;Open in browser&quot;</strong> to use Safari or Chrome, then come back to this page.
        </p>
      </div>
    );
  }

  const canAddMore = photoUrls.length < max;

  return (
    <div className="flex flex-col gap-4 bg-muted p-3 shadow-[inset_0_3px_0_var(--tile)] px-frame">
      {/* The exam tray: thumbnails on a tray, then the drop slot */}
      {/* Thumbnails */}
      {photoUrls.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1 pl-1">
          {photoUrls.map((url) => (
            <div key={url} className="group relative size-24 shrink-0 bg-panel p-[3px] px-frame-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute -top-2 -right-2 grid size-8 place-items-center bg-ink text-panel hover:bg-destructive focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-frame-deep"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {canAddMore && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload photos"
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!uploading) inputRef.current?.click(); } }}
          onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex select-none flex-col items-center justify-center gap-2.5 border-[3px] border-dashed px-4 py-7 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep
            ${uploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
            ${dragOver ? "border-coral-deep bg-rx-soft" : "border-ink/35 bg-panel hover:border-ink/60 hover:bg-[color-mix(in_srgb,var(--butter)_25%,var(--panel))]"}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <DocSprite scale={2} />
              <p className="font-pixel text-xs uppercase tracking-[0.04em] text-ink">Uploading photo…</p>
            </div>
          ) : (
            <>
              <div aria-hidden className="grid size-14 place-items-center bg-powder px-frame">
                <PixelIcon name="camera" size={32} />
              </div>
              <div className="text-center">
                <p className="font-heading text-lg uppercase tracking-[0.02em] text-ink">
                  {photoUrls.length === 0 ? "Upload photos of your card" : "Add more photos"}
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  Tap to choose · Drag &amp; drop · Any photo format · Large files OK
                </p>
              </div>
              <p className="inline-flex h-6 items-center bg-muted px-2 font-pixel text-xs tabular-nums text-ink px-frame">
                {photoUrls.length}/{max} photo{max !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
      )}

      {/* Inline error banner */}
      {uploadError && (
        <div className="flex items-start gap-2 bg-rx-soft px-3 py-2.5 px-frame">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-destructive" strokeWidth={2.25} />
          <p className="text-xs text-destructive font-medium flex-1">{uploadError}</p>
          <button
            type="button"
            onClick={() => setUploadError("")}
            className="-my-2 -mr-2 grid size-9 shrink-0 place-items-center text-destructive hover:bg-panel"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Hidden file input — accepts ANY image (JPEG, PNG, WEBP, HEIC, etc.) */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
