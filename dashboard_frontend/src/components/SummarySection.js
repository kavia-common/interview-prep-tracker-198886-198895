import React from "react";

/**
 * Summary section showing overall readiness and quick stats.
 */
export default function SummarySection({
  title = "Summary",
  subtitle = "Placeholder summary. This will show overall progress and next actions.",
  readinessLabel = "Overall readiness",
  readinessValue = "—",
  stats = [
    { label: "Skills tracked", value: "—" },
    { label: "Avg. progress", value: "—%" },
    { label: "Streak", value: "— days" },
  ],
}) {
  return (
    <section className="Card Card--summary" aria-label="Summary section">
      <div className="Card__header">
        <h2 className="Card__title">{title}</h2>
        <p className="Card__subtitle">{subtitle}</p>
      </div>

      <div className="SummaryTop" aria-label="Overall readiness">
        <div className="Readiness">
          <div className="Readiness__label">{readinessLabel}</div>
          <div className="Readiness__value">{readinessValue}</div>
        </div>

        <div className="Readiness__hint" aria-hidden="true">
          Tip: you’ll see personalized next steps here soon.
        </div>
      </div>

      <div className="SummaryGrid" role="list" aria-label="Summary stats">
        {stats.map((s) => (
          <div className="Stat" role="listitem" key={s.label}>
            <div className="Stat__label">{s.label}</div>
            <div className="Stat__value">{s.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
