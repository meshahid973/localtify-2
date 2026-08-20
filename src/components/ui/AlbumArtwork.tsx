import { Music2 } from "lucide-react";
import { albumArtworkFor } from "../../ALBUM";

export function AlbumArtwork({
  artworkKey,
  className = "",
  alt = "Album artwork",
}: {
  artworkKey: string;
  className?: string;
  alt?: string;
}) {
  const source = albumArtworkFor(artworkKey);

  if (source) {
    return (
      <img
        src={source}
        alt={alt}
        draggable={false}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={`grid place-items-center bg-[linear-gradient(145deg,#202020,#0a0a0a_72%)] text-white/24 ${className}`}
    >
      <Music2 className="size-[28%]" strokeWidth={1.35} />
    </div>
  );
}
