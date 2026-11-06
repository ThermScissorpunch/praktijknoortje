"use client";
import Image from "next/image";

/**
 * Renders images from TinaCMS rich text through next/image, so the original
 * (often 1.5 MB) uploads are resized and served as WebP/AVIF.
 * Width/height only set the placeholder ratio; the real ratio applies once loaded.
 */
export function MarkdownImage({ url, alt }: { url: string; alt?: string }) {
  if (!url) return null;
  return (
    <Image
      src={url}
      alt={alt || ""}
      width={1200}
      height={900}
      sizes="(max-width: 1024px) 100vw, 1024px"
      style={{ width: "100%", height: "auto" }}
    />
  );
}
