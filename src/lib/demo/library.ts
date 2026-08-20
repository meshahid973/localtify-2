import type { Track } from "../contracts/domain";

export const demoTracks: Track[] = [
  { id: "pretty-scene-girl", title: "pretty scene girl!", artistName: "slowed", albumTitle: "local finds", durationMs: 167_000, artworkKey: "sky" },
  { id: "rockstar", title: "so i party like rockstar", artistName: "unknown artist", albumTitle: null, durationMs: 177_000, artworkKey: "lime" },
  { id: "perfect-face", title: "perfect face", artistName: "unknown artist", albumTitle: null, durationMs: 1_078_000, artworkKey: "orbit" },
  { id: "hunter-eyes", title: "hunter eyes", artistName: "unknown artist", albumTitle: null, durationMs: 86_000, artworkKey: "ember" },
  { id: "there", title: "i just wanna be there", artistName: "unknown artist", albumTitle: null, durationMs: 178_000, artworkKey: "cloud" },
  { id: "clover", title: "pretty scene girl", artistName: "clover!", albumTitle: null, durationMs: 190_000, artworkKey: "violet" }
];

export const coverShelf = ["violet", "orbit", "ember", "lime", "cloud", "sky", "aurora", "night", "peach", "ocean"] as const;
