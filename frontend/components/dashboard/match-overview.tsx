import { Badge, Card, CardHeader, CardTitle } from "../ui";
import { matchDistribution, readinessTrend, student } from "./dashboard-data";
import styles from "./dashboard.module.css";

export function MatchOverview() {
  const total = matchDistribution.reduce((sum, band) => sum + band.count, 0);
  const points = readinessTrend
    .map((point, index) => `${48 + index * 140},${136 - point.value * 1.1}`)
    .join(" ");
  return (
    <section aria-labelledby="match-overview-heading">
      <Card className={styles.overview}>
        <CardHeader>
          <div className={styles.sectionHeading}>
            <CardTitle id="match-overview-heading">Match overview</CardTitle>
            <Badge variant="info">Target: {student.targetRole}</Badge>
          </div>
        </CardHeader>
        <div className={styles.trendSummary}>
          <strong>
            78<span>%</span>
          </strong>
          <div>
            <p className={styles.label}>Overall readiness</p>
            <p className={styles.muted}>
              Up 22 percentage points in this sample
            </p>
          </div>
        </div>
        <figure className={styles.chart}>
          <svg
            viewBox="0 0 520 150"
            role="img"
            aria-label="Sample readiness trend: 2 September 56%, 9 September 64%, 16 September 71%, 23 September 78%."
          >
            {[0, 50, 100].map((value) => (
              <g key={value}>
                <line
                  x1="42"
                  x2="492"
                  y1={136 - value * 1.1}
                  y2={136 - value * 1.1}
                  className={styles.gridLine}
                />
                <text x="0" y={140 - value * 1.1} className={styles.axisText}>
                  {value}%
                </text>
              </g>
            ))}
            <polyline points={points} className={styles.trendLine} />
            {readinessTrend.map((point, index) => (
              <circle
                key={point.label}
                cx={48 + index * 140}
                cy={136 - point.value * 1.1}
                r="4"
                className={styles.trendPoint}
              />
            ))}
          </svg>
          <ol className={styles.checkpoints}>
            {readinessTrend.map((point) => (
              <li key={point.label}>
                <span>{point.label}</span>
                <strong>{point.value}%</strong>
              </li>
            ))}
          </ol>
          <figcaption>
            Readiness rose from 56% to 78% across four example checkpoints. This
            is representative data, not a calculated assessment.
          </figcaption>
        </figure>
        <div className={styles.distribution}>
          <h3>
            Match distribution{" "}
            <span className={styles.muted}>· {total} sample opportunities</span>
          </h3>
          <ul>
            {matchDistribution.map((band) => (
              <li key={band.band}>
                <div className={styles.sectionHeading}>
                  <span>
                    {band.label} <small>({band.range})</small>
                  </span>
                  <strong>
                    {band.count} opportunities · {(band.count / total) * 100}%
                  </strong>
                </div>
                <svg
                  viewBox="0 0 100 2"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className={styles.distributionBar}
                  data-band={band.band}
                >
                  <rect width="100" height="2" className={styles.barTrack} />
                  <rect width={(band.count / total) * 100} height="2" />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
}
