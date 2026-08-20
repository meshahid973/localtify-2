import type { DownloadJob, DownloadToolsStatus } from "../contracts/domain";
import { invokeCommand } from "./commands";

export type DownloadToolName = "yt-dlp" | "ffmpeg";

export const downloadsApi = {
  tools: () => invokeCommand<DownloadToolsStatus>("get_download_tools"),
  installTool: (tool: DownloadToolName) =>
    invokeCommand<DownloadToolsStatus>("install_download_tool", { tool }),
  list: () => invokeCommand<DownloadJob[]>("list_downloads"),
  start: (source: string, outputDir: string) =>
    invokeCommand<DownloadJob>("start_audio_download", { source, outputDir }),
};
