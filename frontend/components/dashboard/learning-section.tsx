"use client";
import { useRef, useState } from "react";
import { LearningRecommendationCard } from "../skillbridge";
import { learning, type SampleLearning } from "./dashboard-data";
import { SamplePreview } from "./sample-preview";
import styles from "./dashboard.module.css";

export function LearningSection() {
  const [selected, setSelected] = useState<SampleLearning | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return (
    <section aria-labelledby="learning-heading" className={styles.section}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Small steps, stronger skills</p>
          <h2 id="learning-heading" tabIndex={-1}>
            Learning recommendations
          </h2>
        </div>
      </div>
      <p className={styles.muted}>
        Four suggested outlines for your skill gaps. These are local examples,
        not connected courses.
      </p>
      <div className={styles.learningGrid}>
        {learning.map((resource) => (
          <LearningRecommendationCard
            key={resource.id}
            {...resource}
            headingLevel="h3"
            action={{
              label: "Preview topics",
              onClick: (event) => {
                trigger.current = event.currentTarget;
                setSelected(resource);
              },
            }}
          />
        ))}
      </div>
      {selected && (
        <SamplePreview
          title={`Learning outline: ${selected.title}`}
          onClose={() => {
            setSelected(null);
            trigger.current?.focus();
          }}
        >
          <ul className={styles.topicList}>
            {selected.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
          <p className={styles.muted}>
            An illustrative study outline only; no enrolment or completion
            tracking is connected.
          </p>
        </SamplePreview>
      )}
    </section>
  );
}
