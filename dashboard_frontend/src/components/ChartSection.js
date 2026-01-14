import React, { useId, useMemo } from "react";
import { Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

/**
 * Clamp and normalize a progress value into the 0..100 range.
 * @param {unknown} value
 * @returns {number}
 */
function clampProgress(value) {
  const n = Number(value);
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Compute parent skill progress from sub-skill progress.
 * @param {Array<{progress:number}>} subSkills
 * @returns {number}
 */
function computeSkillProgressFromSubskills(subSkills) {
  if (!Array.isArray(subSkills) || subSkills.length === 0) return 0;
  const sum = subSkills.reduce((acc, s) => acc + clampProgress(s.progress), 0);
  return clampProgress(sum / subSkills.length);
}

/**
 * Build labels and values for the chart from skill state.
 * @param {Array<{id:string,name:string,subSkills?:Array<{progress:number}>}>} skills
 */
function buildChartSeries(skills) {
  const safeSkills = Array.isArray(skills) ? skills : [];
  const labels = safeSkills.map((s) => String(s?.name ?? "Skill"));
  const values = safeSkills.map((s) =>
    computeSkillProgressFromSubskills(s?.subSkills || [])
  );
  return { labels, values };
}

/**
 * Chart section: Radar chart (>= md) + Bar fallback (small screens).
 */
// PUBLIC_INTERFACE
export default function ChartSection({
  title = "Progress Chart",
  subtitle = "Your average progress per skill (updates live as you adjust sub-skills).",
  skills = [],
}) {
  /** Responsive charts driven by the parent skills state via props. */
  const chartId = useId();
  const radarTitleId = `${chartId}-radar-title`;
  const barTitleId = `${chartId}-bar-title`;

  const { labels, values } = useMemo(() => buildChartSeries(skills), [skills]);

  // Shared palette (matches App.css theme variables)
  const primary = "#3b82f6";
  const success = "#06b6d4";
  const text = "#111827";
  const mutedGrid = "rgba(17, 24, 39, 0.10)";

  const radarData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Avg progress",
          data: values,
          borderColor: primary,
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          pointBackgroundColor: success,
          pointBorderColor: "#ffffff",
          pointHoverBackgroundColor: success,
          pointHoverBorderColor: "#ffffff",
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 4,
        },
      ],
    }),
    [labels, values, primary, success]
  );

  const radarOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
          },
        },
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            color: "rgba(17, 24, 39, 0.65)",
            backdropColor: "rgba(255, 255, 255, 0.8)",
          },
          grid: { color: mutedGrid },
          angleLines: { color: mutedGrid },
          pointLabels: { color: text, font: { size: 12, weight: "600" } },
        },
      },
    }),
    [mutedGrid, text]
  );

  const barData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Avg progress",
          data: values,
          backgroundColor: "rgba(6, 182, 212, 0.28)",
          borderColor: success,
          borderWidth: 1,
          borderRadius: 10,
        },
      ],
    }),
    [labels, values, success]
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: text, font: { size: 12, weight: "600" } },
          grid: { display: false },
        },
        y: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20, color: "rgba(17, 24, 39, 0.65)" },
          grid: { color: mutedGrid },
        },
      },
    }),
    [mutedGrid, text]
  );

  const isEmpty = labels.length === 0;

  return (
    <section className="Section" aria-label="Charts section">
      <div className="Section__header">
        <h2 className="Section__title">{title}</h2>
        <p className="Section__subtitle">{subtitle}</p>
      </div>

      <div className="Card ChartCard">
        {isEmpty ? (
          <div className="ChartPlaceholder" role="img" aria-label="No skills to chart">
            <div className="ChartPlaceholder__grid" aria-hidden="true" />
            <div className="ChartPlaceholder__label">No data yet</div>
          </div>
        ) : (
          <div className="ChartShell" aria-label="Skill progress charts">
            {/* Radar: visible on >= md screens */}
            <div className="ChartView ChartView--radar" aria-label="Radar chart">
              <h3 className="VisuallyHidden" id={radarTitleId}>
                Skill progress radar chart
              </h3>
              <div className="ChartCanvas" role="img" aria-labelledby={radarTitleId}>
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* Bar fallback: visible on small screens */}
            <div className="ChartView ChartView--bar" aria-label="Bar chart">
              <h3 className="VisuallyHidden" id={barTitleId}>
                Skill progress bar chart
              </h3>
              <div className="ChartCanvas" role="img" aria-labelledby={barTitleId}>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
