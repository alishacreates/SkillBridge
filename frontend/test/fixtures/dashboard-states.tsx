import { useState } from "react";
import { Button } from "../../components/ui";
import {
  RecommendationsSection,
  type RecommendationState,
} from "../../components/dashboard/recommendations-section";
import { opportunities } from "../../components/dashboard/dashboard-data";
import styles from "./primitives.module.css";

export function DashboardStatesFixture() {
  const [state, setState] = useState<RecommendationState>("ready");
  return (
    <section
      id="dashboard-states"
      aria-label="Dashboard state fixture"
      className={styles.section}
    >
      <h2>Dashboard recommendation states</h2>
      <p>Explicit local states for testing. No timers or simulated requests.</p>
      <div className={styles.row}>
        {(["ready", "loading", "empty", "error"] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            aria-pressed={state === value}
            onClick={() => setState(value)}
          >
            Show {value} state
          </Button>
        ))}
      </div>
      <RecommendationsSection
        state={state}
        opportunities={opportunities}
        onRetry={() => setState("ready")}
      />
    </section>
  );
}
