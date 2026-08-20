import type { PressableProps } from "../../ui/motion/Pressable";
import { Pressable } from "../../ui/motion/Pressable";

export function AeroButton({ className = "", ...props }: PressableProps) {
  return <Pressable {...props} className={`themed-button ${className}`} />;
}
