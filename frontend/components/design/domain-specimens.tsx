"use client";
import { useRef, useState } from "react";
import {
  ApplicationStatusBadge,
  CandidateMatchRow,
  DashboardStatCard,
  DeadlineItem,
  LearningRecommendationCard,
  MatchScore,
  OpportunityCard,
  ProfileCompletion,
  SkillChip,
  SkillGapCard,
  SkillProgress,
} from "../skillbridge";
import { Button } from "../ui";
import {
  applicationStatuses,
  sampleLearning,
  sampleOpportunity,
  sampleSkills,
} from "./catalog";
import styles from "./design.module.css";

export function DomainSpecimens() {
  const [message, setMessage] = useState(
    "Fictional examples. Inspect actions describe the specimen; no product operation is performed.",
  );
  const [removed, setRemoved] = useState(false);
  const restore = useRef<HTMLButtonElement>(null);
  function inspect(name: string) {
    setMessage(
      `Inspecting ${name}. This component receives typed display data and a caller-owned action; no API is connected.`,
    );
  }
  return (
    <section
      id="domain"
      aria-labelledby="domain-heading"
      className={styles.section}
    >
      <header className={styles.sectionHeader}>
        <h2 id="domain-heading" tabIndex={-1}>
          SkillBridge components
        </h2>
        <p>
          The same primitives, given product meaning. All people, opportunities,
          and scores below are examples.
        </p>
      </header>
      <p role="status" className={styles.feedback}>
        {message}
      </p>
      <h3>SkillChip &amp; MatchScore</h3>
      <div className={styles.row}>
        {sampleSkills.map((skill) => (
          <SkillChip key={skill.name} {...skill} />
        ))}
        {!removed && (
          <SkillChip
            name="Docker"
            proficiency="BEGINNER"
            onRemove={() => {
              setRemoved(true);
              setMessage("Docker removed from this example only.");
              restore.current?.focus();
            }}
          />
        )}
        <Button
          ref={restore}
          variant="ghost"
          onClick={() => {
            setRemoved(false);
            setMessage("Docker chip restored.");
          }}
        >
          Restore Docker chip
        </Button>
      </div>
      <div className={styles.scoreGrid}>
        {[96, 82, 65, 42].map((score) => (
          <MatchScore key={score} score={score} size="large" />
        ))}
      </div>
      <h3>ApplicationStatusBadge</h3>
      <div className={styles.row}>
        {applicationStatuses.map((status) => (
          <ApplicationStatusBadge key={status} status={status} />
        ))}
      </div>
      <p className={styles.note}>
        A rejection is an application outcome, not a system error. A displayed
        status never changes application state.
      </p>
      <div className={styles.twoColumns}>
        <div className={styles.stack}>
          <p className={styles.specimenLabel}>OpportunityCard</p>
          <OpportunityCard
            {...sampleOpportunity}
            action={{
              label: "Inspect example",
              onClick: () => inspect("Nova Labs opportunity"),
            }}
          />
        </div>
        <div className={styles.stack}>
          <p className={styles.specimenLabel}>SkillGapCard</p>
          <SkillGapCard
            headingLevel="h3"
            targetRole="Frontend Engineer"
            readiness={76}
            strongSkills={sampleSkills.slice(0, 3)}
            missingSkills={[
              { name: "Jest" },
              { name: "Cypress" },
              { name: "Web Performance" },
            ]}
            action={{
              label: "Inspect pathway",
              onClick: () => inspect("Frontend Engineer pathway"),
            }}
          />
          <p className={styles.specimenLabel}>SkillProgress</p>
          <SkillProgress
            skill="PostgreSQL"
            current="Beginner"
            target="Intermediate"
            percentage={35}
          />
          <SkillProgress
            skill="Technical communication"
            current="Practising"
            target="Present a project walkthrough"
          />
        </div>
      </div>
      <div className={styles.twoColumns}>
        <div className={styles.stack}>
          <p className={styles.specimenLabel}>ProfileCompletion</p>
          <ProfileCompletion
            headingLevel="h3"
            percentage={75}
            completedItems={6}
            totalItems={8}
            nextAction={{
              label: "Inspect profile progress",
              onClick: () => inspect("profile completion"),
            }}
          />
        </div>
        <div className={styles.stack}>
          <p className={styles.specimenLabel}>DashboardStatCard</p>
          <DashboardStatCard
            label="Strong matches"
            value={12}
            context="Supplied example data, not calculated analytics"
            accent="chart-purple"
          />
        </div>
      </div>
      <h3>LearningRecommendationCard</h3>
      <div className={styles.threeColumns}>
        {sampleLearning.map((resource) => (
          <LearningRecommendationCard
            key={resource.title}
            {...resource}
            headingLevel="h4"
            action={{
              label: "Inspect example",
              onClick: () => inspect(resource.title),
            }}
          />
        ))}
      </div>
      <h3>CandidateMatchRow</h3>
      <CandidateMatchRow
        headingLevel="h4"
        name="Asha Patel"
        summary="B.Tech Computer Science · Riverdale Institute of Technology and Applied Sciences"
        topSkills={sampleSkills}
        matchScore={94}
        applicationStatus="INTERVIEW"
        action={{
          label: "Inspect example",
          onClick: () => inspect("Asha Patel"),
        }}
      />
      <CandidateMatchRow
        headingLevel="h4"
        name="Dev Menon"
        summary="B.Sc Information Systems · Coastal University"
        topSkills={[{ name: "Python" }, { name: "SQL" }]}
        matchScore={48}
        applicationStatus="REJECTED"
        action={{
          label: "Inspect example",
          onClick: () => inspect("Dev Menon"),
        }}
      />
      <h3>DeadlineItem</h3>
      <div className={styles.threeColumns}>
        <DeadlineItem
          headingLevel="h4"
          title="Frontend Engineer Intern"
          context="Nova Labs · sample"
          type="Application deadline"
          date={{ dateTime: "2026-10-15", label: "15 October 2026" }}
          urgency="upcoming"
        />
        <DeadlineItem
          headingLevel="h4"
          title="Testing fundamentals"
          context="Example assessment"
          type="Assessment deadline"
          date={{ dateTime: "2026-10-02", label: "2 October 2026" }}
          urgency="soon"
        />
        <DeadlineItem
          headingLevel="h4"
          title="Confirm availability"
          context="Example interview"
          type="Response deadline"
          date={{ dateTime: "2026-09-20", label: "20 September 2026" }}
          urgency="overdue"
        />
      </div>
      <p className={styles.note}>
        Dates and urgency are fixed specimens, not relative to today.
      </p>
    </section>
  );
}
