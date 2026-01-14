import React from "react";
import SkillCard from "./SkillCard";

/**
 * Skills grid section: displays interactive skill cards with sub-skill controls.
 */
export default function SkillsGrid({
  title = "Skills",
  subtitle = "Adjust sub-skill progress to update your readiness in real time.",
  skills = [],
  onSetSubSkillProgress,
}) {
  return (
    <section className="Section" aria-label="Skill cards section">
      <div className="Section__header">
        <h2 className="Section__title">{title}</h2>
        <p className="Section__subtitle">{subtitle}</p>
      </div>

      <div className="SkillGrid" role="list" aria-label="Skill cards grid">
        {skills.map((skill) => (
          <div role="listitem" key={skill.id}>
            <SkillCard skill={skill} onSetSubSkillProgress={onSetSubSkillProgress} />
          </div>
        ))}
      </div>
    </section>
  );
}
