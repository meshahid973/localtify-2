import type { PlayerState, RepeatMode } from "../contracts/domain";
import { invokeCommand } from "./commands";

export const playerApi = {
  state: () => invokeCommand<PlayerState>("get_player_state"),
  play: (trackId: string) => invokeCommand<PlayerState>("player_play_track", { trackId }),
  toggle: () => invokeCommand<PlayerState>("player_toggle"),
  seek: (positionMs: number) => invokeCommand<PlayerState>("player_seek", { positionMs }),
  setVolume: (volume: number) => invokeCommand<PlayerState>("player_set_volume", { volume }),
  toggleMute: () => invokeCommand<PlayerState>("player_toggle_mute"),
  setShuffle: (enabled: boolean) => invokeCommand<PlayerState>("player_set_shuffle", { enabled }),
  setRepeat: (repeat: RepeatMode) => invokeCommand<PlayerState>("player_set_repeat", { repeat }),
};
