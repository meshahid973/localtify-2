import type { LibrarySnapshot, ScanResult } from "../contracts/domain";
import { invokeCommand } from "./commands";

export const libraryApi = {
  snapshot: () => invokeCommand<LibrarySnapshot>("get_library_snapshot"),
  scan: (path: string) => invokeCommand<ScanResult>("scan_library", { path }),
};
