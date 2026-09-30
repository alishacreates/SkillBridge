"use client";
import { useId, useRef, useState } from "react";
import { Button, Card, EmptyState, ErrorState, Skeleton } from "../ui";
import { OpportunityCard } from "../skillbridge";
import { SamplePreview } from "./sample-preview";
import type { SampleOpportunity } from "./dashboard-data";
import styles from "./dashboard.module.css";
export type RecommendationState = "ready" | "loading" | "empty" | "error";
export type RecommendationsSectionProps = {
  opportunities: readonly SampleOpportunity[];
  state?: RecommendationState;
  query?: string;
  onClearSearch?: () => void;
  onRetry?: () => void;
};
export function RecommendationsSection({
  opportunities,
  state = "ready",
  query = "",
  onClearSearch,
  onRetry,
}: RecommendationsSectionProps) {
  const headingId = useId();
  const [selected, setSelected] = useState<SampleOpportunity | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return (
    <section
      className={styles.section}
      aria-labelledby={headingId}
      aria-busy={state === "loading" || undefined}
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Your next step</p>
          <h2 id={headingId}>Recommended opportunities</h2>
        </div>
        <p className={styles.muted} role="status">
          {state === "ready"
            ? `${opportunities.length} fictional opportunities${query ? ` matching “${query}”` : " · sample matches"}`
            : "Sample state preview"}
        </p>
      </div>
      {state === "loading" ? (
        <div>
          <p role="status">Loading sample opportunities…</p>
          <div className={styles.opportunityGrid}>
            {[1, 2, 3].map((item) => (
              <Card key={item} className={styles.loadingCard}>
                <Skeleton />
                <Skeleton shape="block" />
                <Skeleton />
                <Skeleton shape="block" />
              </Card>
            ))}
          </div>
        </div>
      ) : state === "error" ? (
        <ErrorState
          headingLevel={3}
          heading="Could not display recommendations"
          description="This is a local error-state example. Restore the sample data to continue; no server request is made."
          action={
            onRetry && (
              <Button variant="outline" onClick={onRetry}>
                Restore sample data
              </Button>
            )
          }
        />
      ) : state === "empty" || !opportunities.length ? (
        <EmptyState
          headingLevel={3}
          heading={query ? "No matching samples" : "No recommendations yet"}
          description={
            query
              ? "Try a company, role, or skill from the three sample opportunities."
              : "This example has no opportunities to display. No live recommendations are connected."
          }
          action={
            query && onClearSearch ? (
              <Button variant="outline" onClick={onClearSearch}>
                Show all samples
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className={styles.opportunityGrid}>
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                {...opportunity}
                headingLevel="h3"
                action={{
                  label: "View sample details",
                  onClick: (event) => {
                    trigger.current = event.currentTarget;
                    setSelected(opportunity);
                  },
                }}
              />
            ))}
          </div>
          {selected && (
            <SamplePreview
              title={`Sample details: ${selected.title}`}
              onClose={() => {
                setSelected(null);
                trigger.current?.focus();
              }}
            >
              <p>{selected.description}</p>
            </SamplePreview>
          )}
        </>
      )}
    </section>
  );
}
