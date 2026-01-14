import React, { useEffect, useMemo, useReducer } from "react";
import "./App.css";

import Header from "./components/Header";
import SummarySection from "./components/SummarySection";
import SkillsGrid from "./components/SkillsGrid";
import ChartSection from "./components/ChartSection";

const STORAGE_KEY = "interview_prep_tracker_v1";

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
 * Compute a parent skill progress from sub-skill progress values.
 * @param {Array<{progress: number}>} subSkills
 * @returns {number}
 */
function computeSkillProgressFromSubskills(subSkills) {
  if (!Array.isArray(subSkills) || subSkills.length === 0) return 0;
  const sum = subSkills.reduce((acc, s) => acc + clampProgress(s.progress), 0);
  return clampProgress(sum / subSkills.length);
}

/**
 * Returns the default initial state for the app.
 * Skill structure supports nested subSkills and independent progress values.
 */
function getDefaultState() {
  return {
    version: 1,
    skills: [
      {
        id: "dsa",
        name: "DSA",
        tone: "primary",
        subSkills: [
          { id: "arrays-strings", name: "Arrays & Strings", progress: 20 },
          { id: "trees-graphs", name: "Trees & Graphs", progress: 10 },
          { id: "dp-greedy", name: "DP & Greedy", progress: 5 },
        ],
      },
      {
        id: "system-design",
        name: "System Design",
        tone: "success",
        subSkills: [
          { id: "fundamentals", name: "Fundamentals", progress: 15 },
          { id: "scalability", name: "Scalability", progress: 10 },
          { id: "tradeoffs", name: "Tradeoffs", progress: 5 },
        ],
      },
      {
        id: "frontend",
        name: "Frontend",
        tone: "neutral",
        subSkills: [
          { id: "react", name: "React", progress: 25 },
          { id: "web-platform", name: "Web Platform", progress: 15 },
          { id: "perf-accessibility", name: "Perf & A11y", progress: 10 },
        ],
      },
    ],
  };
}

/**
 * Normalize state loaded from localStorage to ensure it matches expectations:
 * - numbers are clamped 0..100
 * - arrays exist
 * - missing fields get safe defaults
 * @param {any} raw
 */
function normalizeState(raw) {
  const fallback = getDefaultState();
  if (!raw || typeof raw !== "object") return fallback;

  const rawSkills = Array.isArray(raw.skills) ? raw.skills : fallback.skills;

  const skills = rawSkills
    .filter((s) => s && typeof s === "object")
    .map((s) => {
      const subSkillsRaw = Array.isArray(s.subSkills) ? s.subSkills : [];
      const subSkills = subSkillsRaw
        .filter((ss) => ss && typeof ss === "object")
        .map((ss) => ({
          id: String(ss.id ?? ss.name ?? Math.random()),
          name: String(ss.name ?? "Sub-skill"),
          progress: clampProgress(ss.progress),
        }));

      return {
        id: String(s.id ?? s.name ?? Math.random()),
        name: String(s.name ?? "Skill"),
        tone: s.tone === "primary" || s.tone === "success" ? s.tone : "neutral",
        subSkills,
      };
    });

  return {
    version: 1,
    skills,
  };
}

/**
 * Load persisted state from localStorage.
 * Returns null if absent/unreadable so reducer can fall back to default.
 */
function loadStateFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * Persist state to localStorage.
 * @param {any} state
 */
function saveStateToStorage(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore write failures (e.g. private mode / quota). App still works in-memory.
  }
}

/**
 * Reducer supports "reset" and interactive "setSubSkillProgress".
 */
function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return getDefaultState();

    case "setSubSkillProgress": {
      const { skillId, subSkillId, progress } = action.payload || {};
      if (!skillId || !subSkillId) return state;

      const nextSkills = state.skills.map((skill) => {
        if (skill.id !== skillId) return skill;

        const nextSubSkills = skill.subSkills.map((ss) => {
          if (ss.id !== subSkillId) return ss;
          return { ...ss, progress: clampProgress(progress) };
        });

        return { ...skill, subSkills: nextSubSkills };
      });

      return { ...state, skills: nextSkills };
    }

    default:
      return state;
  }
}

/**
 * Initializer ensures we only touch localStorage once on mount.
 */
function init() {
  return loadStateFromStorage() ?? getDefaultState();
}

// PUBLIC_INTERFACE
function App() {
  /** Interview Prep Tracker: dashboard UI + client-side model (no backend). */
  const [state, dispatch] = useReducer(reducer, undefined, init);

  // Persist state to localStorage on changes.
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const totals = useMemo(() => {
    const skills = state.skills || [];
    const trackedSkills = skills.length;

    const allSubSkills = skills.flatMap((s) => s.subSkills || []);
    const trackedSubSkills = allSubSkills.length;

    const completedSubSkills = allSubSkills.filter(
      (ss) => clampProgress(ss.progress) >= 100
    ).length;

    const avgSkillProgress =
      trackedSkills === 0
        ? 0
        : clampProgress(
            skills.reduce((acc, s) => {
              return acc + computeSkillProgressFromSubskills(s.subSkills);
            }, 0) / trackedSkills
          );

    return {
      trackedSkills,
      trackedSubSkills,
      completedSubSkills,
      avgSkillProgress,
    };
  }, [state.skills]);

  return (
    <div className="App">
      <Header
        title="Interview Prep Tracker"
        tagline="Track skills. Build momentum."
        primaryActionLabel="Reset (demo)"
        onPrimaryAction={() => dispatch({ type: "reset" })}
      />

      <main className="Main">
        <section className="Container">
          <SummarySection
            readinessValue={`${totals.avgSkillProgress}%`}
            subtitle="Overall readiness updates as you adjust sub-skill progress."
            stats={[
              { label: "Skills tracked", value: String(totals.trackedSkills) },
              { label: "Avg. progress", value: `${totals.avgSkillProgress}%` },
              {
                label: "Sub-skills done",
                value: `${totals.completedSubSkills}/${totals.trackedSubSkills}`,
              },
            ]}
          />

          <SkillsGrid
            skills={state.skills}
            subtitle="Use sliders and +/- controls to set progress for each sub-skill."
            onSetSubSkillProgress={(skillId, subSkillId, progress) =>
              dispatch({
                type: "setSubSkillProgress",
                payload: { skillId, subSkillId, progress },
              })
            }
          />

          <ChartSection skills={state.skills} />
        </section>
      </main>
    </div>
  );
}

export default App;
