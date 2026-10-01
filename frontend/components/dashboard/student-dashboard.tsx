"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Badge, Card, CardHeader, CardTitle, IconButton, Input } from "../ui";
import {
  ApplicationStatusBadge,
  DashboardStatCard,
  DeadlineItem,
  ProfileCompletion,
  SkillGapCard,
  SkillProgress,
} from "../skillbridge";
import { DashboardShell } from "../../layout/dashboard-shell";
import { DashboardIcon } from "../../layout/dashboard-icons";
import {
  applications,
  deadlines,
  metrics,
  opportunities,
  skills,
  snapshot,
  student,
} from "./dashboard-data";
import { MatchOverview } from "./match-overview";
import { RecommendationsSection } from "./recommendations-section";
import { LearningSection } from "./learning-section";
import styles from "./dashboard.module.css";

export function StudentDashboard() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const normalized = query.trim().toLowerCase();
  const filtered = opportunities.filter((item) =>
    [
      item.title,
      item.company,
      ...item.requiredSkills.map((skill) => skill.name),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
  function clearSearch() {
    setDraft("");
    setQuery("");
    input.current?.focus();
  }
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (composing.current) return;
    setQuery(draft.trim());
    results.current?.focus();
  }
  const searchField = (
    <form
      role="search"
      onSubmit={search}
      noValidate
      className={styles.searchForm}
    >
      <Input
        ref={input}
        label="Search sample opportunities"
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={() => {
          composing.current = false;
        }}
        placeholder="Try React or Nova Labs"
      />
      <div className={styles.searchActions}>
        <span className={styles.clearSlot}>
          {draft && (
            <IconButton label="Clear search" onClick={clearSearch}>
              <DashboardIcon name="close" />
            </IconButton>
          )}
        </span>
        <IconButton label="Search opportunities" type="submit">
          <DashboardIcon name="search" />
        </IconButton>
      </div>
    </form>
  );
  return (
    <DashboardShell search={searchField} student={student}>
      <main id="main-content" tabIndex={-1} className={styles.main}>
        <section className={styles.welcome} aria-labelledby="welcome-heading">
          <div className={styles.sectionHeading}>
            <Badge>Student dashboard · Design preview</Badge>
            <time dateTime={snapshot.dateTime} className={styles.muted}>
              Sample snapshot · {snapshot.label}
            </time>
          </div>
          <div className={styles.welcomeCopy}>
            <div>
              <h1 id="welcome-heading">Welcome back, {student.firstName}.</h1>
              <p>
                Your profile is getting stronger. You’re a strong match for
                several software engineering internships in this sample.
              </p>
            </div>
            <p className={styles.brandNote} data-brand-note aria-hidden="true">
              your next opportunity
            </p>
          </div>
          <p className={styles.previewNotice}>
            Representative local data · No live opportunities, applications, or
            account connection.
          </p>
        </section>
        <section aria-label="Dashboard metrics" className={styles.metrics}>
          {metrics.map((metric) => (
            <DashboardStatCard key={metric.label} {...metric} />
          ))}
        </section>
        <div className={styles.grid}>
          <div className={styles.mainInsight}>
            <MatchOverview />
          </div>
          <section
            className={styles.sideInsight}
            aria-labelledby="skills-heading"
          >
            <Card>
              <CardHeader>
                <CardTitle id="skills-heading">Skill proficiency</CardTitle>
                <p className={styles.muted}>
                  Your current skill pathway · sample levels
                </p>
              </CardHeader>
              <div className={styles.skillsGrid}>
                {skills.map((skill) => (
                  <SkillProgress key={skill.skill} {...skill} />
                ))}
              </div>
            </Card>
          </section>
          <div
            id="opportunity-examples"
            ref={results}
            role="group"
            tabIndex={-1}
            aria-label="Opportunity search results"
            className={styles.fullWidth}
          >
            <RecommendationsSection
              key={query}
              opportunities={filtered}
              query={query}
              onClearSearch={clearSearch}
            />
          </div>
          <div className={styles.learningColumn}>
            <LearningSection />
          </div>
          <div className={styles.pathwayColumn}>
            <section aria-label="Skill gap summary">
              <SkillGapCard
                targetRole={student.targetRole}
                readiness={78}
                strongSkills={[
                  { name: "React" },
                  { name: "TypeScript" },
                  { name: "Git", verified: true },
                ]}
                missingSkills={[
                  { name: "Jest" },
                  { name: "Cypress" },
                  { name: "Redux" },
                  { name: "Web Performance" },
                ]}
                action={{
                  label: "Explore learning steps",
                  href: "#learning-heading",
                }}
              />
            </section>
            <section
              aria-label="Your profile progress"
              className={styles.section}
            >
              <ProfileCompletion
                percentage={82}
                completedItems={9}
                totalItems={11}
                nextAction={{
                  label: "View next profile step",
                  href: "#profile-next-step",
                }}
              />
              <div
                id="profile-next-step"
                tabIndex={-1}
                className={styles.nextStep}
              >
                <p className={styles.label}>Next: add a portfolio link</p>
                <p>
                  Choose a project that shows how you build. Profile editing is
                  not available in this preview.
                </p>
              </div>
            </section>
          </div>
          <section
            aria-labelledby="applications-heading"
            className={styles.applicationsColumn}
          >
            <Card>
              <CardHeader>
                <CardTitle id="applications-heading">
                  Recent applications
                </CardTitle>
                <p className={styles.muted}>
                  4 of 7 sample applications · Read-only
                </p>
              </CardHeader>
              <ul className={styles.applicationList}>
                {applications.map((application) => (
                  <li key={application.id}>
                    <div>
                      <h3>{application.title}</h3>
                      <p>
                        {application.company} · Submitted {application.date}
                      </p>
                    </div>
                    <ApplicationStatusBadge status={application.status} />
                  </li>
                ))}
              </ul>
            </Card>
          </section>
          <section
            aria-labelledby="deadlines-heading"
            className={styles.deadlinesColumn}
          >
            <Card>
              <CardHeader>
                <CardTitle id="deadlines-heading">Upcoming deadlines</CardTitle>
                <p className={styles.muted}>
                  Urgency relative to the sample snapshot
                </p>
              </CardHeader>
              <ol className={styles.deadlineList}>
                {deadlines.map((deadline) => (
                  <li key={deadline.id}>
                    <DeadlineItem {...deadline} headingLevel="h3" />
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </div>
        <footer className={styles.footer}>
          A clearer path from what you know to what comes next.
          <Link href="/design">Design system</Link>
        </footer>
      </main>
    </DashboardShell>
  );
}
