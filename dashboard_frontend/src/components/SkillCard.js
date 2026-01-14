import React, { useCallback, useId, useMemo } from "react";
import ProgressBar from "./ProgressBar";

const STEP = 5;

/**
 * Clamp and normalize a progress value into the 0..100 range.
 * Kept local to component to avoid importing from App.js.
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
 * Make a safe HTML id fragment.
 * @param {string} s
 * @returns {string}
 */
function toIdFragment(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// PUBLIC_INTERFACE
export default function SkillCard({ skill, onSetSubSkillProgress }) {
  /** Interactive skill card showing sub-skills with progress controls and derived completion. */
  const reactId = useId();

  const skillProgress = useMemo(() => {
    return computeSkillProgressFromSubskills(skill?.subSkills || []);
  }, [skill]);

  const pillClass =
    skill?.tone === "primary"
      ? "Pill Pill--primary"
      : skill?.tone === "success"
        ? "Pill Pill--success"
        : "Pill";

  const onDelta = useCallback(
    (subSkillId, delta) => {
      if (!skill?.id || !subSkillId) return;
      const sub = (skill.subSkills || []).find((s) => s.id === subSkillId);
      const current = clampProgress(sub?.progress);
      onSetSubSkillProgress?.(skill.id, subSkillId, clampProgress(current + delta));
    },
    [onSetSubSkillProgress, skill]
  );

  const onSliderChange = useCallback(
    (subSkillId, nextValue) => {
      if (!skill?.id || !subSkillId) return;
      onSetSubSkillProgress?.(skill.id, subSkillId, clampProgress(nextValue));
    },
    [onSetSubSkillProgress, skill]
  );

  const cardLabelId = `${reactId}-${toIdFragment(skill?.id || skill?.name || "skill")}-label`;

  return (
    <article className="SkillCard" aria-labelledby={cardLabelId}>
      <div className="SkillCard__top">
        <div>
          <h3 className="SkillCard__title" id={cardLabelId}>
            {skill?.name}
          </h3>
          <div className="SkillCard__meta">
            {(skill?.subSkills || []).length} sub-skills • Avg {skillProgress}%
          </div>
        </div>

        <span className={pillClass} aria-label={`${skill?.name} completion ${skillProgress}%`}>
          {skillProgress}%
        </span>
      </div>

      <ProgressBar
        value={skillProgress}
        tone={skill?.tone}
        ariaLabel={`${skill?.name} overall progress`}
      />

      <div className="SubSkillList" role="list" aria-label={`${skill?.name} sub-skills`}>
        {(skill?.subSkills || []).map((ss) => {
          const clamped = clampProgress(ss.progress);

          const rowId = `${reactId}-${toIdFragment(skill?.id)}-${toIdFragment(ss.id)}`;
          const labelId = `${rowId}-label`;
          const helpId = `${rowId}-help`;

          return (
            <div className="SubSkillRow" role="listitem" key={ss.id}>
              <div className="SubSkillRow__top">
                <div className="SubSkillRow__name" id={labelId}>
                  {ss.name}
                </div>

                <div className="SubSkillRow__value" aria-label={`${ss.name} progress`}>
                  {clamped}%
                </div>
              </div>

              <div className="SubSkillRow__controls" aria-describedby={helpId}>
                <div className="Stepper" role="group" aria-label={`${ss.name} stepper controls`}>
                  <button
                    className="Stepper__btn"
                    type="button"
                    onClick={() => onDelta(ss.id, -STEP)}
                    aria-label={`Decrease ${ss.name} by ${STEP}%`}
                    disabled={clamped <= 0}
                  >
                    −
                  </button>

                  <button
                    className="Stepper__btn"
                    type="button"
                    onClick={() => onDelta(ss.id, +STEP)}
                    aria-label={`Increase ${ss.name} by ${STEP}%`}
                    disabled={clamped >= 100}
                  >
                    +
                  </button>
                </div>

                <input
                  className="Slider"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={clamped}
                  onChange={(e) => onSliderChange(ss.id, e.target.value)}
                  aria-labelledby={labelId}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={clamped}
                  aria-label={`${ss.name} progress slider`}
                />
              </div>

              <div className="SubSkillRow__hint" id={helpId}>
                Use the slider or +/- buttons (steps of {STEP}%). Values are clamped to 0–100.
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
