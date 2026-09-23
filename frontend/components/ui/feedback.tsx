import type { ReactNode } from "react";
import { classes } from "./classes";
import styles from "./feedback.module.css";

export type FeedbackProps = {
  heading: string;
  description: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

function Feedback({
  heading,
  description,
  action,
  headingLevel = 2,
  className,
  error = false,
  announce = false,
}: FeedbackProps & { error?: boolean; announce?: boolean }) {
  const Heading = headingLevel === 2 ? "h2" : headingLevel === 3 ? "h3" : "h4";
  return (
    <section
      aria-label={heading}
      data-error={error || undefined}
      className={classes(styles.state, className)}
    >
      <div className={styles.copy} role={announce ? "alert" : undefined}>
        {error && (
          <span aria-hidden="true" className={styles.errorMark}>
            !
          </span>
        )}
        <Heading className={styles.heading}>{heading}</Heading>
        <div className={styles.description}>{description}</div>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </section>
  );
}

export function EmptyState(props: FeedbackProps) {
  return <Feedback {...props} />;
}
export function ErrorState(props: FeedbackProps & { announce?: boolean }) {
  return <Feedback {...props} error />;
}

export type SkeletonProps = {
  shape?: "text" | "circle" | "block";
  animate?: boolean;
  className?: string;
};
export function Skeleton({
  shape = "text",
  animate = true,
  className,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      data-shape={shape}
      data-animate={animate || undefined}
      className={classes(styles.skeleton, className)}
    />
  );
}
