import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.wordmark}>
          <span className={styles.mark} aria-hidden="true">s<span>b</span></span>
          SkillBridge
        </p>
        <p className={styles.availability}>Coming soon</p>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <div className={styles.introduction}>
          <p className={styles.eyebrow}>From potential to possibility</p>
          <h1 className={styles.title}>Your skills.<br />Your next chapter.</h1>
          <p className={styles.description}>
            A place to turn what you know into where you go next.
            We’re building SkillBridge for the opportunities ahead of you.
          </p>
          <p className={styles.brandNote}>A little ambition goes a long way.</p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Made for the work you want to do.</p>
        <div className={styles.accents} aria-hidden="true">
          <span /><span /><span />
        </div>
      </footer>
    </div>
  );
}
