import { Badge } from "../ui";
import {
  brandColors,
  chartColors,
  layoutWidths,
  radiusScale,
  semanticColors,
  shadowScale,
  spaceScale,
  typeRoles,
} from "./catalog";
import styles from "./design.module.css";

export function TokenSpecimens() {
  return (
    <>
      <section
        id="brand"
        aria-labelledby="brand-heading"
        className={styles.section}
      >
        <header className={styles.sectionHeader}>
          <h2 id="brand-heading" tabIndex={-1}>
            Brand colors
          </h2>
          <p>
            Five locked colors. Each has a job, not just a place on a palette.
          </p>
        </header>
        <ul className={styles.palette}>
          {brandColors.map((color) => (
            <li key={color.key} className={styles.swatchCard}>
              <div
                className={styles.swatch}
                data-brand={color.key}
                data-color-token={color.token}
                data-hex={color.hex}
                aria-hidden="true"
              />
              <div className={styles.swatchCopy}>
                <h3>{color.name}</h3>
                <code>{color.token}</code>
                <strong>{color.hex}</strong>
                <p>{color.usage}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section
        id="semantic"
        aria-labelledby="semantic-heading"
        className={styles.section}
      >
        <header className={styles.sectionHeader}>
          <h2 id="semantic-heading" tabIndex={-1}>
            Semantic colors
          </h2>
          <p>
            Meaning is independent from the brand. Pink is an accent, not an
            error state.
          </p>
        </header>
        <ul className={styles.semanticGrid}>
          {semanticColors.map((color) => (
            <li
              key={color.key}
              className={styles.semanticSample}
              data-semantic={color.key}
            >
              <Badge variant={color.key}>{color.key}</Badge>
              <p>{color.meaning}</p>
              <code>{`--color-${color.key}`}</code>
              <strong>{color.hex}</strong>
              <span
                className={styles.semanticMark}
                data-color-token={`--color-${color.key}`}
                data-hex={color.hex}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      </section>
      <section
        id="data-viz"
        aria-labelledby="data-viz-heading"
        className={styles.section}
      >
        <header className={styles.sectionHeader}>
          <h2 id="data-viz-heading" tabIndex={-1}>
            Data visualization
          </h2>
          <p>
            Readable hues for data, with names and values that remain useful
            without color.
          </p>
        </header>
        <figure className={styles.chartPanel}>
          <figcaption>
            Chart palette · illustrative counts, not product analytics
          </figcaption>
          <ul className={styles.chartList}>
            {chartColors.map((color) => (
              <li key={color.key}>
                <div>
                  <strong>
                    {color.name} · {color.value} examples
                  </strong>
                  <span>
                    <code>{`--chart-${color.key}`}</code> · {color.hex}
                  </span>
                </div>
                <svg
                  viewBox="0 0 100 3"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className={styles.chartBar}
                  data-chart={color.key}
                >
                  <rect width="100" height="3" className={styles.chartTrack} />
                  <rect
                    width={color.value}
                    height="3"
                    data-color-token={`--chart-${color.key}`}
                    data-hex={color.hex}
                  />
                </svg>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Each series occupies its own labelled row. These colors are not a
            substitute for labels, shapes, or patterns in a multi-series chart.
          </p>
        </figure>
      </section>
      <section
        id="typography"
        aria-labelledby="typography-heading"
        className={styles.section}
      >
        <header className={styles.sectionHeader}>
          <h2 id="typography-heading" tabIndex={-1}>
            Typography
          </h2>
          <p>
            Inter carries the work: navigation, numbers, controls, and reading.
            Felipa adds one quiet brand accent.
          </p>
        </header>
        <div className={styles.typeList}>
          {typeRoles.map((role) => (
            <div key={role} className={styles.typeRow}>
              <div>
                <strong>{role}</strong>
                <code>{`--type-${role}-size`}</code>
              </div>
              <p className={styles.typeSample} data-type={role}>
                A clearer path forward.
              </p>
            </div>
          ))}
        </div>
        <div className={styles.decorativeSpecimen}>
          <p>Felipa · decorative only</p>
          <p className={styles.brandAccent} data-design-felipa>
            your next opportunity
          </p>
          <p className={styles.note}>
            Never used for controls, data, navigation, or body copy.
          </p>
        </div>
      </section>
      <section
        id="geometry"
        aria-labelledby="geometry-heading"
        className={styles.section}
      >
        <header className={styles.sectionHeader}>
          <h2 id="geometry-heading" tabIndex={-1}>
            Space, shape &amp; layout
          </h2>
          <p>
            Shared measures keep a small field and a full dashboard in the same
            visual family.
          </p>
        </header>
        <h3>Spacing</h3>
        <ul className={styles.measureList}>
          {spaceScale.map((size) => (
            <li key={size}>
              <code>{`--space-${size}`}</code>
              <span>{size * 4}px</span>
              <span
                className={styles.spaceBar}
                data-space={size}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
        <h3>Radius</h3>
        <ul className={styles.radiusGrid}>
          {radiusScale.map((size) => (
            <li key={size}>
              <div
                className={styles.radiusShape}
                data-radius={size}
                aria-hidden="true"
              />
              <code>{`--radius-${size}`}</code>
            </li>
          ))}
        </ul>
        <h3>Shadows</h3>
        <p className={styles.note}>
          Elevation is optional. Production cards remain flat by default.
        </p>
        <ul className={styles.shadowGrid}>
          {shadowScale.map((size) => (
            <li key={size} className={styles.shadowSample} data-shadow={size}>
              <code>{`--shadow-${size}`}</code>
            </li>
          ))}
        </ul>
        <h3>Layout widths</h3>
        <p className={styles.note}>
          Actual maximum widths, capped to this panel on smaller screens. Pixel
          equivalents assume a 16px root font size.
        </p>
        <ul className={styles.layoutList}>
          {layoutWidths.map((width) => (
            <li key={width.key}>
              <div>
                <code>{width.token}</code>
                <span>{width.label}</span>
              </div>
              <div
                className={styles.layoutBar}
                data-width={width.key}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
