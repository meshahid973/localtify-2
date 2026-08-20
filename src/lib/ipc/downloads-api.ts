import type { DownloadJob, DownloadToolsStatus } from "../contracts/domain";
import { invokeCommand } from "./commands";

export const downloadsApi = {
  tools: () => invokeCommand<DownloadToolsStatus>("get_download_tools"),
  list: () => invokeCommand<DownloadJob[]>("list_downloads"),
  start: (source: string, outputDir: string) =>
    invokeCommand<DownloadJob>("start_audio_download", { source, outputDir }),
};
