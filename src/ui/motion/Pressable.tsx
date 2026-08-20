import type { AriaRole, CSSProperties, MouseEventHandler, ReactNode } from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { InteractionFlash } from "./InteractionFlash";
import type { PressableStrength } from "./motion.types";
import { useInteractionMotion } from "./useInteractionMotion";

export interface PressableProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  ariaChecked?: boolean;
  role?: AriaRole;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  strength?: PressableStrength;
  flash?: boolean;
  highlight?: boolean;
}

export function Pressable({
  children,
  className = "",
  style,
  type = "button",
  disabled = false,
  title,
  ariaLabel,
  ariaChecked,
  role,
  onClick,
  strength = "medium",
  flash = true,
  highlight = true,
}: PressableProps) {
  const [flashKey, setFlashKey] = useState(0);
  const interaction = useInteractionMotion(strength);

  return (
    <motion.button
      type={type}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      aria-checked={ariaChecked}
      role={role}
      style={style}
      animate={interaction.controls}
      onHoverStart={interaction.hoverStart}
      onHoverEnd={interaction.hoverEnd}
      onPointerDown={interaction.pressStart}
      onPointerUp={interaction.pressEnd}
      onPointerCancel={interaction.pressEnd}
      onPointerLeave={interaction.pressEnd}
      onClick={(event) => {
        if (!disabled && flash) setFlashKey((value) => value + 1);
        onClick?.(event);
      }}
      className={`pressable relative isolate overflow-hidden ${className}`}
    >
      {highlight && <span aria-hidden className="interaction-hover-layer pointer-events-none absolute inset-0 z-0 rounded-[inherit]" />}
      {children}
      {flash && flashKey > 0 && (
        <InteractionFlash key={flashKey} opacity={interaction.profile.flashOpacity} duration={interaction.profile.flashDuration} />
      )}
    </motion.button>
  );
}
