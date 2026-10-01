import Link from "next/link";
import { Badge } from "../ui";
import { sectionLinks } from "./catalog";
import { TokenSpecimens } from "./token-specimens";
import { PrimitiveSpecimens } from "./primitive-specimens";
import { DomainSpecimens } from "./domain-specimens";
import { StateLab } from "./state-lab";
import styles from "./design.module.css";

export function DesignShowcase() {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <p className={styles.wordmark}>
          Skill<span>Bridge</span>
        </p>
        <nav aria-label="Page navigation" className={styles.row}>
          <Link href="/">Dashboard</Link>
          <span aria-current="page">Design system</span>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <div className={styles.intro}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>The system behind the workspace</p>
            <h1>SkillBridge Design System</h1>
            <p>
              A shared language for turning skills into opportunities. Explore
              the tokens, controls, and product components that shape the
              student dashboard.
            </p>
            <div className={styles.row}>
              {[
                "React + TypeScript",
                "Token-driven",
                "Accessibility-aware",
                "Responsive",
              ].map((label) => (
                <Badge key={label}>{label}</Badge>
              ))}
            </div>
          </div>
          <div className={styles.introAside}>
            <p className={styles.brandAccent} aria-hidden="true">
              built to connect
            </p>
            <p>
              Not a picture of a system.
              <br />
              The system itself, in use.
            </p>
            <a href="#architecture-heading">See how the layers connect</a>
          </div>
        </div>
        <div className={styles.referenceLayout}>
          <nav aria-label="Design system sections" className={styles.index}>
            <p className={styles.eyebrow}>In this reference</p>
            <ul>
              {sectionLinks.map(([id, name]) => (
                <li key={id}>
                  <a href={`#${id}-heading`}>{name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.sections}>
            <TokenSpecimens />
            <PrimitiveSpecimens />
            <DomainSpecimens />
            <StateLab />
            <section
              id="accessibility"
              aria-labelledby="accessibility-heading"
              className={styles.section}
            >
              <header className={styles.sectionHeader}>
                <h2 id="accessibility-heading" tabIndex={-1}>
                  Accessibility
                </h2>
                <p>Designed and tested with accessibility considerations.</p>
              </header>
              <ul className={styles.accessList}>
                <li>
                  <strong>Semantic HTML.</strong> Native buttons, links, fields,
                  progress, and fieldset/legend retain familiar browser
                  behavior.
                </li>
                <li>
                  <strong>Keyboard navigation.</strong> Logical order, skip
                  navigation, real actions, and visible focus. No clickable card
                  containers.
                </li>
                <li>
                  <strong>Associated labels and errors.</strong> Shared field
                  IDs connect labels, help, and error text; invalid inputs
                  expose their state programmatically.
                </li>
                <li>
                  <strong>Motion and forced colors.</strong> Reduced-motion
                  preferences suppress animation. System colors preserve focus
                  and readable controls in forced-colors mode.
                </li>
                <li>
                  <strong>Data beyond color.</strong> Match scores, statuses,
                  and charts include text and values, not just colored marks.
                </li>
                <li>
                  <strong>Contrast-conscious tokens.</strong> Text/control
                  colors are tested in their intended pairings. Decorative
                  pink/yellow are not small-text colors on a light canvas.
                </li>
              </ul>
              <p className={styles.note}>
                Automated tests and browser review are useful evidence, not full
                WCAG certification or screen-reader certification. Manual
                assistive-technology and wider browser testing remain important.
              </p>
            </section>
            <section
              id="architecture"
              aria-labelledby="architecture-heading"
              className={styles.section}
            >
              <header className={styles.sectionHeader}>
                <h2 id="architecture-heading" tabIndex={-1}>
                  System architecture
                </h2>
                <p>
                  One direction of composition. Shared decisions flow into
                  reusable controls, then into product meaning.
                </p>
              </header>
              <ol className={styles.layers}>
                <li>
                  <strong>Design Tokens</strong>
                  <code>styles/tokens.css</code>
                  <p>Color, typography, spacing, shape, motion, and focus.</p>
                </li>
                <li>
                  <strong>UI Primitives</strong>
                  <code>components/ui/</code>
                  <p>Generic visuals, semantics, and interaction behavior.</p>
                </li>
                <li>
                  <strong>SkillBridge Domain Components</strong>
                  <code>components/skillbridge/</code>
                  <p>Typed product data composed with the generic controls.</p>
                </li>
                <li>
                  <strong>Pages</strong>
                  <code>app/ · components/dashboard/ · components/design/</code>
                  <p>Arrange sections and own local example state.</p>
                </li>
              </ol>
              <div className={styles.composition}>
                <p>Card + Badge + SkillChip + MatchScore + Button</p>
                <span aria-hidden="true">↓</span>
                <strong>OpportunityCard</strong>
                <span aria-hidden="true">↓</span>
                <p>Dashboard recommendation section</p>
                <Link href="/#opportunity-examples">
                  See the dashboard composition
                </Link>
              </div>
              <p className={styles.note}>
                MatchScore presents a supplied score; it does not run a matching
                algorithm. These pages use representative local data, not
                backend APIs.
              </p>
            </section>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>SkillBridge · A shared foundation, built to grow.</p>
        <a href="#main-content">Back to top ↑</a>
      </footer>
    </div>
  );
}
