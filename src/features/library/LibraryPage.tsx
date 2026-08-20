import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Play, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { usePlayerStore } from "../player/player.store";
import { useLibraryStore } from "./library.store";

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
    <main className="mx-auto w-full max-w-[1500px] px-7 pb-14 pt-6 lg:px-10">
      <header className="flex flex-wrap items-end gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/22">On this device</p>
          <h1 className="mt-1 font-mono text-[30px] font-semibold tracking-[-0.055em] text-[#f3f0dd]">Library</h1>
        </div>
        <span className="mb-1 font-mono text-[8px] text-white/22">{tracks.length} tracks · {folders.length} folders</span>

        <div className="ml-auto flex items-center gap-2">
          <label className="flex h-9 w-[min(360px,42vw)] items-center gap-2 rounded-[9px] border border-white/[0.06] bg-[#0d0d0d] px-3.5 transition-colors focus-within:border-white/[0.13]">
            <Search className="size-3.5 text-white/25" />
            <input
              data-library-search
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setVisible(INITIAL_VISIBLE);
              }}
              placeholder="Search tracks, artists, albums"
              className="w-full bg-transparent font-mono text-[10px] text-[#dedac8] outline-none placeholder:text-white/18"
            />
          </label>
          <button
            type="button"
            disabled={scanning}
            onClick={() => void chooseFolder()}
            className="grid size-9 place-items-center rounded-[9px] bg-[#f3f0dd] text-[#151515] transition-transform active:scale-[.97] disabled:opacity-40"
            aria-label="Add music folder"
          >
            <FolderPlus className="size-4" />
          </button>
        </div>
      </header>

      <div className="performance-section mt-6 overflow-hidden rounded-[11px] border border-white/[0.05] bg-[#0b0b0b]">
        <div className="grid grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] gap-3 border-b border-white/[0.05] px-3 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/20">
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
              className={`group grid w-full grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] items-center gap-3 border-b border-white/[0.035] px-3 py-2 text-left transition-colors last:border-0 ${
                active ? "bg-[#181817]" : "hover:bg-[#121212]"
              }`}
            >
              <span className="grid place-items-center font-mono text-[9px] tabular-nums text-white/20">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play className="hidden size-3 fill-current text-[#e7e3d0] group-hover:block" />
              </span>

              <span className="flex min-w-0 items-center gap-3">
                <AlbumArtwork artworkKey={track.artworkKey} className="size-10 shrink-0 rounded-[4px]" alt="" />
                <span className="min-w-0">
                  <span className={`block truncate font-mono text-[10px] font-semibold ${active ? "text-[#7cda99]" : "text-[#e3dfcd]"}`}>
                    {track.title}
                  </span>
                  <span className="mt-1 block truncate font-mono text-[8px] text-white/24">{track.artistName}</span>
                </span>
              </span>

              <span className="truncate font-mono text-[9px] text-white/22">{track.albumTitle ?? "—"}</span>
              <span className="text-right font-mono text-[8px] tabular-nums text-white/20">{formatDuration(track.durationMs)}</span>
            </button>
          );
        })}
      </div>

      {visible < filtered.length && (
        <button
          type="button"
          onClick={() => setVisible((count) => count + INITIAL_VISIBLE)}
          className="mx-auto mt-5 block rounded-full border border-white/[0.07] px-4 py-2 font-mono text-[9px] text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
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
