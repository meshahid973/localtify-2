import { useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useSettingsStore } from "../../features/settings/settings.store";
import { interactionProfile, OUT_QUINT } from "./presets";
import type { PressableStrength } from "./motion.types";

export function useInteractionMotion(strength: PressableStrength = "medium") {
  const controls = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const motionStyle = useSettingsStore((state) => state.motion);
  const bounce = useSettingsStore((state) => state.bounceIntensity);
  const pressed = useRef(false);
  const hovered = useRef(false);
  const holdTimer = useRef<number | null>(null);

  const profile = interactionProfile(motionStyle, bounce, strength);
  const disabled = reducedMotion || motionStyle === "off";

  useEffect(() => () => {
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
  }, []);

  function clearHoldTimer() {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  function hoverStart() {
    hovered.current = true;
    if (disabled || pressed.current) return;
    void controls.start({
      scale: profile.hoverScale,
      y: profile.hoverY,
      transition: { duration: profile.hoverDuration, ease: OUT_QUINT },
    });
  }

  function hoverEnd() {
    hovered.current = false;
    if (disabled || pressed.current) return;
    void controls.start({ scale: 1, y: 0, transition: { duration: 0.24, ease: OUT_QUINT } });
  }

  function pressStart() {
    if (disabled) return;
    pressed.current = true;
    clearHoldTimer();
    void controls.start({
      scale: profile.pressStart,
      y: 0,
      transition: { duration: profile.pressDuration, ease: OUT_QUINT },
    });
    holdTimer.current = window.setTimeout(() => {
      if (!pressed.current) return;
      void controls.start({
        scale: profile.pressDeep,
        transition: { duration: motionStyle === "osu" ? 0.38 : 0.3, ease: OUT_QUINT },
      });
    }, profile.holdDelay);
  }

  function pressEnd() {
    if (disabled) return;
    if (!pressed.current) return;
    pressed.current = false;
    clearHoldTimer();
    void controls.start({
      scale: hovered.current ? profile.hoverScale : 1,
      y: hovered.current ? profile.hoverY : 0,
      transition: profile.release,
    });
  }

  return {
    controls,
    disabled,
    profile,
    hoverStart,
    hoverEnd,
    pressStart,
    pressEnd,
  };
}
