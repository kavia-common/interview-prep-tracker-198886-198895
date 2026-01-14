import React from "react";

/**
 * Chart section placeholder (radar/bar planned).
 */
export default function ChartSection({
  title = "Progress Chart",
  subtitle = "Placeholder chart area (radar chart planned).",
  placeholderLabel = "Chart placeholder",
}) {
  return (
    <section className="Section" aria-label="Charts section">
      <div className="Section__header">
        <h2 className="Section__title">{title}</h2>
        <p className="Section__subtitle">{subtitle}</p>
      </div>

      <div className="Card ChartCard" aria-label="Chart placeholder">
        <div className="ChartPlaceholder" role="img" aria-label={placeholderLabel}>
          <div className="ChartPlaceholder__grid" aria-hidden="true" />
          <div className="ChartPlaceholder__label">{placeholderLabel}</div>
        </div>
      </div>
    </section>
  );
}
