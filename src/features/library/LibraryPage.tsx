import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Play, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { useLibraryStore } from "./library.store";
import { usePlayerStore } from "../player/player.store";

const INITIAL_VISIBLE = 120;

export function LibraryPage() {
  const tracks = useLibraryStore((state) => state.tracks);
  const folders = useLibraryStore((state) => state.folders);
  const scanning = useLibraryStore((state) => state.scanning);
  const addFolder = useLibraryStore((state) => state.addFolder);
  const player = usePlayerStore((state) => state.state);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return tracks;
    return tracks.filter((track) =>
      `${track.title} ${track.artistName} ${track.albumTitle ?? ""}`.toLocaleLowerCase().includes(needle),
    );
  }, [query, tracks]);

  async function chooseFolder() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Add music folder" });
    if (typeof selected === "string") await addFolder(selected);
  }

  return (
    <main className="mx-auto w-full max-w-[1540px] px-6 pb-14 pt-7 lg:px-10">
      <header className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/28">On this device</p>
          <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.055em]">Library</h1>
        </div>
        <span className="mb-1 text-[11px] text-white/30">{tracks.length} tracks · {folders.length} folders</span>

        <div className="ml-auto flex items-center gap-2">
          <label className="flex h-10 w-[min(360px,42vw)] items-center gap-2 rounded-full border border-white/[0.07] bg-[#0d0d0d] px-4">
            <Search className="size-4 text-white/30" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setVisible(INITIAL_VISIBLE);
              }}
              placeholder="Search tracks, artists, albums"
              className="w-full bg-transparent text-[12px] text-white outline-none placeholder:text-white/25"
            />
          </label>
          <button
            type="button"
            disabled={scanning}
            onClick={() => void chooseFolder()}
            className="grid size-10 place-items-center rounded-full bg-[#f5f5ef] text-black disabled:opacity-50"
            aria-label="Add music folder"
          >
            <FolderPlus className="size-4" />
          </button>
        </div>
      </header>

      <div className="performance-section mt-7 overflow-hidden rounded-xl border border-white/[0.06] bg-[#070707]">
        <div className="grid grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] gap-3 border-b border-white/[0.06] px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25">
          <span className="text-center">#</span>
          <span>Title</span>
          <span>Album</span>
          <span className="text-right">Time</span>
        </div>

        {filtered.slice(0, visible).map((track, index) => {
          const active = player.currentTrack?.id === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => void playTrack(track.id)}
              className={`group grid w-full grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] items-center gap-3 border-b border-white/[0.045] px-3 py-2 text-left transition-colors last:border-0 ${
                active ? "bg-white/[0.075]" : "hover:bg-white/[0.04]"
              }`}
            >
              <span className="grid place-items-center text-[10px] tabular-nums text-white/25">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play className="hidden size-3 fill-current text-white group-hover:block" />
              </span>

              <span className="flex min-w-0 items-center gap-3">
                <AlbumArtwork artworkKey={track.artworkKey} className="size-10 shrink-0 rounded-[5px]" alt="" />
                <span className="min-w-0">
                  <span className={`block truncate text-[12px] font-medium ${active ? "text-[#1ed760]" : "text-[#ededeb]"}`}>
                    {track.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-white/30">{track.artistName}</span>
                </span>
              </span>

              <span className="truncate text-[11px] text-white/28">{track.albumTitle ?? "—"}</span>
              <span className="text-right text-[10px] tabular-nums text-white/25">{formatDuration(track.durationMs)}</span>
            </button>
          );
        })}
      </div>

      {visible < filtered.length && (
        <button
          type="button"
          onClick={() => setVisible((count) => count + INITIAL_VISIBLE)}
          className="mx-auto mt-5 block rounded-full border border-white/[0.08] px-4 py-2 text-[11px] text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/75"
        >
          Show more
        </button>
      )}
    </main>
  );
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
