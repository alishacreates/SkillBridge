import { useState } from "react";
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
  type ApplicationStatus,
  type Skill,
} from "../../components/skillbridge";
import styles from "./primitives.module.css";

const skills: readonly Skill[] = [
  { name: "React", proficiency: "INTERMEDIATE" },
  { name: "TypeScript" },
  { name: "Accessible interface engineering" },
  { name: "PostgreSQL", proficiency: "BEGINNER" },
  { name: "Git", proficiency: "ADVANCED", verified: true },
  { name: "Automated testing" },
  { name: "Responsive design" },
];
const statuses: readonly ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
];

export function DomainFixture() {
  const [message, setMessage] = useState("No domain actions yet");
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <section
      id="domain-fixture"
      aria-labelledby="domain-heading"
      className={styles.section}
    >
      <header className={styles.header}>
        <h2 id="domain-heading">SkillBridge domain components</h2>
        <p>
          Representative data only. Actions change this fixture, not a backend.
        </p>
        <div role="status" data-testid="domain-feedback">
          {message}
        </div>
      </header>

      <section aria-label="Skills and match scores" className={styles.section}>
        <h3>Compact meaning, without color dependence</h3>
        <div className={styles.row}>
          {skills.map((skill) => (
            <SkillChip key={skill.name} {...skill} />
          ))}
          {!removed && (
            <SkillChip
              name="Docker"
              onRemove={() => {
                setRemoved(true);
                setMessage("Docker removed from fixture");
              }}
            />
          )}
          <SkillChip
            name="Required fixture skill"
            onRemove={() => setMessage("Must remain disabled")}
            removeDisabled
          />
        </div>
        <div className={styles.row}>
          {statuses.map((status) => (
            <ApplicationStatusBadge key={status} status={status} />
          ))}
        </div>
        <div className={styles.grid}>
          <MatchScore score={96} size="large" />
          <MatchScore score={42} size="large" />
          <MatchScore score={78} />
          <MatchScore score={65} />
        </div>
      </section>

      <section aria-label="Opportunity card examples" className={styles.grid}>
        <OpportunityCard
          headingLevel="h3"
          company="Northstar Labs"
          title="Frontend engineering intern — accessible developer platforms and collaboration tools"
          location="Bengaluru, Karnataka"
          workMode="Hybrid"
          stipend="₹25,000 / month"
          duration="6 months"
          deadline={{ dateTime: "2026-10-15", label: "15 October 2026" }}
          requiredSkills={skills}
          matchScore={92}
          applicationStatus="APPLIED"
          action={{ label: "View opportunity", href: "#fixture-details" }}
        />
        <OpportunityCard
          headingLevel="h3"
          company="Common Ground Studio"
          title="Data engineering internship"
          location="India"
          workMode="Remote"
          stipend="₹18,000 / month"
          duration="3 months"
          deadline={{ dateTime: "2026-10-02", label: "2 October 2026" }}
          requiredSkills={[
            { name: "Python" },
            { name: "SQL" },
            { name: "Data modelling" },
          ]}
          matchScore={48}
          applicationStatus="SAVED"
          action={{
            label: "Preview application",
            onClick: () => {
              setBusy(true);
              setMessage("Application preview pending in fixture");
            },
            loading: busy,
          }}
        />
      </section>

      <section
        aria-label="Pathway and completion examples"
        className={styles.grid}
      >
        <SkillGapCard
          headingLevel="h3"
          targetRole="Full-stack developer"
          readiness={68}
          strongSkills={skills.slice(0, 3)}
          missingSkills={[
            { name: "API design" },
            { name: "Database indexing" },
          ]}
          action={{
            label: "Explore next steps",
            onClick: () => setMessage("Pathway next steps selected"),
          }}
        />
        <ProfileCompletion
          headingLevel="h3"
          percentage={75}
          completedItems={6}
          totalItems={8}
          nextAction={{
            label: "Add your bio",
            onClick: () => setMessage("Profile bio action selected"),
          }}
        />
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
      </section>

      <section aria-label="Metric examples" className={styles.grid}>
        <DashboardStatCard
          label="Applications"
          value={12}
          context="3 more submitted this month"
          accent="chart-purple"
        />
        <DashboardStatCard
          label="Strong matches"
          value={8}
          context="From the supplied example opportunities"
          accent="success"
          icon={<span>↗</span>}
        />
      </section>

      <section
        aria-label="Learning recommendation examples"
        className={styles.grid}
      >
        <LearningRecommendationCard
          headingLevel="h3"
          skill="PostgreSQL"
          title="Practical queries and relational data modelling"
          difficulty="BEGINNER"
          priority="HIGH"
          estimatedEffort="4 hours"
          action={{
            label: "Preview resource",
            onClick: () => setMessage("PostgreSQL resource preview selected"),
          }}
        />
        <LearningRecommendationCard
          headingLevel="h3"
          skill="React"
          title="Designing accessible component APIs"
          difficulty="INTERMEDIATE"
          priority="MEDIUM"
          estimatedEffort="2 hours"
          action={{
            label: "Preview resource",
            onClick: () => setMessage("React resource preview selected"),
          }}
        />
        <LearningRecommendationCard
          headingLevel="h3"
          skill="Git"
          title="Advanced collaboration workflows"
          difficulty="ADVANCED"
          priority="LOW"
          action={{
            label: "Preview resource",
            onClick: () => setMessage("Git resource preview selected"),
          }}
        />
      </section>

      <section aria-label="Candidate examples" className={styles.section}>
        <CandidateMatchRow
          headingLevel="h3"
          name="Asha Patel"
          summary="B.Tech Computer Science · Riverdale Institute of Technology and Applied Sciences"
          topSkills={skills.slice(0, 4)}
          matchScore={94}
          avatar={{ src: "/avatar.svg" }}
          applicationStatus="SELECTED"
          action={{
            label: "View profile",
            onClick: () => setMessage("Asha Patel profile selected"),
          }}
        />
        <CandidateMatchRow
          headingLevel="h3"
          name="Dev Menon"
          summary="B.Sc Information Systems · Coastal University"
          topSkills={[{ name: "Python" }, { name: "SQL" }]}
          matchScore={54}
          applicationStatus="REJECTED"
          action={{
            label: "View profile",
            onClick: () => setMessage("Dev Menon profile selected"),
          }}
        />
      </section>

      <section aria-label="Deadline examples" className={styles.grid}>
        <DeadlineItem
          headingLevel="h3"
          title="Frontend engineering intern"
          context="Northstar Labs"
          date={{ dateTime: "2026-10-15", label: "15 October 2026" }}
          type="Application deadline"
          status="Applied"
          urgency="upcoming"
        />
        <DeadlineItem
          headingLevel="h3"
          title="Data engineering internship"
          context="Common Ground Studio"
          date={{ dateTime: "2026-10-02", label: "2 October 2026" }}
          type="Application deadline"
          urgency="soon"
        />
        <DeadlineItem
          headingLevel="h3"
          title="Confirm interview availability"
          context="Example application follow-up"
          date={{ dateTime: "2026-09-20", label: "20 September 2026" }}
          type="Response deadline"
          urgency="overdue"
        />
      </section>
      <section
        id="fixture-details"
        tabIndex={-1}
        aria-labelledby="fixture-details-heading"
      >
        <h3 id="fixture-details-heading">Fixture navigation destination</h3>
        <p>
          This target only verifies native link navigation. No opportunity page
          or API exists.
        </p>
      </section>
    </section>
  );
}
