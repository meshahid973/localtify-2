export type ThemeId = "oled" | "aero";
export type AeroEnvironment = "sky" | "ocean" | "meadow";
export type AeroGlassStrength = "light" | "balanced" | "glossy";

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  description: string;
}
