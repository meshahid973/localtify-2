import type { Track } from "../../lib/contracts/domain";

export function filterTracks(tracks: Track[], query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return tracks;

  return tracks.filter((track) => {
    const haystack = `${track.title}\n${track.artistName}\n${track.albumTitle ?? ""}`.toLocaleLowerCase();
    return haystack.includes(normalized);
  });
}
