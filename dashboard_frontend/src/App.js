import React from "react";
import "./App.css";

import Header from "./components/Header";
import SummarySection from "./components/SummarySection";
import SkillsGrid from "./components/SkillsGrid";
import ChartSection from "./components/ChartSection";

// PUBLIC_INTERFACE
function App() {
  /** Interview Prep Tracker: dashboard UI layout (no backend). */
  return (
    <div className="App">
      <Header
        title="Interview Prep Tracker"
        tagline="Track skills. Build momentum."
        primaryActionLabel="Add Skill (soon)"
        onPrimaryAction={() => {}}
      />

      <main className="Main">
        <section className="Container">
          <SummarySection
            readinessValue="—"
            stats={[
              { label: "Skills tracked", value: "—" },
              { label: "Avg. progress", value: "—%" },
              { label: "Streak", value: "— days" },
            ]}
          />

          <SkillsGrid />

          <ChartSection />
        </section>
      </main>
    </div>
  );
}

export default App;
