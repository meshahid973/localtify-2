const modules = import.meta.glob("./*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const albumArtwork = Object.values(modules);

export function albumArtworkFor(key: string, fallbackIndex = 0): string | null {
  if (albumArtwork.length === 0) {
    return null;
  }

  let hash = 2166136261;
  const value = key || String(fallbackIndex);
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return albumArtwork[Math.abs(hash) % albumArtwork.length] ?? albumArtwork[fallbackIndex % albumArtwork.length] ?? null;
}
