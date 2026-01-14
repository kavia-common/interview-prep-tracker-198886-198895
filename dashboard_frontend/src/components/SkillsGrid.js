import React from "react";

/**
 * Skills grid section: displays skill cards with progress placeholders.
 */
export default function SkillsGrid({
  title = "Skills",
  subtitle = "Placeholder grid for skill cards (DSA, System Design, Frontend, etc.).",
  skills = [
    { name: "DSA", progress: 0, tone: "primary", meta: "Placeholder" },
    {
      name: "System Design",
      progress: 0,
      tone: "success",
      meta: "Placeholder",
    },
    { name: "Frontend", progress: 0, tone: "neutral", meta: "Placeholder" },
    { name: "Behavioral", progress: 0, tone: "neutral", meta: "Placeholder" },
    { name: "Networking", progress: 0, tone: "primary", meta: "Placeholder" },
    { name: "Databases", progress: 0, tone: "success", meta: "Placeholder" },
  ],
}) {
  return (
    <section className="Section" aria-label="Skill cards section">
      <div className="Section__header">
        <h2 className="Section__title">{title}</h2>
        <p className="Section__subtitle">{subtitle}</p>
      </div>

      <div className="SkillGrid" role="list" aria-label="Skill cards grid">
        {skills.map((skill) => {
          const clamped = Math.max(0, Math.min(100, Number(skill.progress) || 0));
          const pillClass =
            skill.tone === "primary"
              ? "Pill Pill--primary"
              : skill.tone === "success"
                ? "Pill Pill--success"
                : "Pill";
          const barClass =
            skill.tone === "success"
              ? "Progress__bar Progress__bar--success"
              : "Progress__bar";

          return (
            <div className="SkillCard" role="listitem" key={skill.name}>
              <div className="SkillCard__top">
                <h3 className="SkillCard__title">{skill.name}</h3>
                <span className={pillClass}>{clamped}%</span>
              </div>

              <div className="Progress" aria-label={`${skill.name} progress`}>
                <div className={barClass} style={{ width: `${clamped}%` }} />
              </div>

              <div className="SkillCard__meta">{skill.meta}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
