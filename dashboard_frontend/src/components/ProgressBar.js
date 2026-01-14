import React from "react";

/**
 * Presentational progress bar. Does not manage state.
 * Uses existing App.css classes (Progress / Progress__bar).
 */
export default function ProgressBar({
  value,
  tone = "neutral",
  ariaLabel,
  id,
}) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  const barClass =
    tone === "success"
      ? "Progress__bar Progress__bar--success"
      : "Progress__bar";

  return (
    <div className="Progress" id={id} aria-label={ariaLabel}>
      <div className={barClass} style={{ width: `${clamped}%` }} />
    </div>
  );
}
