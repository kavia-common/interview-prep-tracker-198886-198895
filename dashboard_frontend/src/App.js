import React from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  /** Interview Prep Tracker: dashboard shell (no backend). */
  return (
    <div className="App">
      <header className="TopBar">
        <div className="TopBar__inner">
          <div className="Brand">
            <div className="Brand__mark" aria-hidden="true" />
            <div className="Brand__text">
              <div className="Brand__name">Interview Prep Tracker</div>
              <div className="Brand__tagline">Track skills. Build momentum.</div>
            </div>
          </div>

          <div className="TopBar__actions" aria-label="Header actions">
            <button className="Button Button--primary" type="button">
              Add Skill (soon)
            </button>
          </div>
        </div>
      </header>

      <main className="Main">
        <section className="Container">
          <section className="Card Card--summary" aria-label="Summary section">
            <div className="Card__header">
              <h2 className="Card__title">Summary</h2>
              <p className="Card__subtitle">
                Placeholder summary. This will show overall progress and next
                actions.
              </p>
            </div>

            <div className="SummaryGrid" role="list" aria-label="Summary stats">
              <div className="Stat" role="listitem">
                <div className="Stat__label">Skills tracked</div>
                <div className="Stat__value">—</div>
              </div>
              <div className="Stat" role="listitem">
                <div className="Stat__label">Avg. progress</div>
                <div className="Stat__value">—%</div>
              </div>
              <div className="Stat" role="listitem">
                <div className="Stat__label">Streak</div>
                <div className="Stat__value">— days</div>
              </div>
            </div>
          </section>

          <section className="Section" aria-label="Skill cards section">
            <div className="Section__header">
              <h2 className="Section__title">Skills</h2>
              <p className="Section__subtitle">
                Placeholder grid for skill cards (DSA, System Design, Frontend,
                etc.).
              </p>
            </div>

            <div className="SkillGrid" role="list" aria-label="Skill cards grid">
              <div className="SkillCard" role="listitem">
                <div className="SkillCard__top">
                  <h3 className="SkillCard__title">DSA</h3>
                  <span className="Pill Pill--primary">0%</span>
                </div>
                <div className="Progress" aria-label="DSA progress">
                  <div className="Progress__bar" style={{ width: "0%" }} />
                </div>
                <div className="SkillCard__meta">Placeholder</div>
              </div>

              <div className="SkillCard" role="listitem">
                <div className="SkillCard__top">
                  <h3 className="SkillCard__title">System Design</h3>
                  <span className="Pill Pill--success">0%</span>
                </div>
                <div className="Progress" aria-label="System Design progress">
                  <div className="Progress__bar Progress__bar--success" style={{ width: "0%" }} />
                </div>
                <div className="SkillCard__meta">Placeholder</div>
              </div>

              <div className="SkillCard" role="listitem">
                <div className="SkillCard__top">
                  <h3 className="SkillCard__title">Frontend</h3>
                  <span className="Pill">0%</span>
                </div>
                <div className="Progress" aria-label="Frontend progress">
                  <div className="Progress__bar" style={{ width: "0%" }} />
                </div>
                <div className="SkillCard__meta">Placeholder</div>
              </div>
            </div>
          </section>

          <section className="Section" aria-label="Charts section">
            <div className="Section__header">
              <h2 className="Section__title">Progress Chart</h2>
              <p className="Section__subtitle">
                Placeholder chart area (radar chart planned).
              </p>
            </div>

            <div className="Card ChartCard" aria-label="Chart placeholder">
              <div className="ChartPlaceholder" role="img" aria-label="Chart placeholder">
                <div className="ChartPlaceholder__grid" aria-hidden="true" />
                <div className="ChartPlaceholder__label">Chart placeholder</div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
