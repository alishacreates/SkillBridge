"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { Avatar, Badge, IconButton } from "../components/ui";
import { DashboardIcon, type DashboardIconName } from "./dashboard-icons";
import styles from "./dashboard-shell.module.css";

const destinations: readonly { label: string; icon: DashboardIconName }[] = [
  { label: "Opportunities", icon: "opportunities" },
  { label: "Skill Assessment", icon: "assessment" },
  { label: "Skill Gap Analysis", icon: "gaps" },
  { label: "Applications", icon: "applications" },
  { label: "Profile", icon: "profile" },
];
function Navigation({
  label,
  currentRef,
  onNavigate,
}: {
  label: string;
  currentRef?: Ref<HTMLAnchorElement>;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label={label}>
      <ul className={styles.navList}>
        <li>
          <Link
            ref={currentRef}
            href="/"
            aria-current="page"
            className={styles.current}
            {...(onNavigate ? { onClick: onNavigate } : {})}
          >
            <DashboardIcon name="dashboard" />
            <span>Dashboard</span>
          </Link>
        </li>
        {destinations.map(({ label, icon }) => (
          <li key={label} className={styles.unavailable}>
            <DashboardIcon name={icon} />
            <span>
              {label}
              <small>Coming soon</small>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DashboardShell({
  children,
  search,
  student,
}: {
  children: ReactNode;
  search: ReactNode;
  student: { name: string; summary: string };
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const mobileCurrent = useRef<HTMLAnchorElement>(null);
  const desktopCurrent = useRef<HTMLAnchorElement>(null);
  const lastFocused = useRef<EventTarget | null>(null);
  useEffect(() => {
    if (open) mobileCurrent.current?.focus();
  }, [open]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const change = (event: MediaQueryListEvent) => {
      // CSS may hide the focused link before the media callback, resetting focus
      // to body. Remember its owner without stealing focus from other controls.
      const focused =
        document.activeElement === document.body
          ? lastFocused.current
          : document.activeElement;
      if (event.matches) {
        if (
          focused &&
          (focused === mobileCurrent.current || focused === trigger.current)
        )
          desktopCurrent.current?.focus();
        setOpen(false);
      } else if (focused === desktopCurrent.current) {
        trigger.current?.focus();
      }
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  function closeMenu() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      className={styles.shell}
      onFocusCapture={(event) => {
        lastFocused.current = event.target;
      }}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          closeMenu();
        }
      }}
    >
      <aside className={styles.sidebar}>
        <div className={styles.workspace}>
          <span className={styles.workspaceMark} aria-hidden="true">
            SB
          </span>
          <div>
            <strong>Student workspace</strong>
            <p>Build your next chapter</p>
          </div>
        </div>
        <Navigation label="Desktop navigation" currentRef={desktopCurrent} />
        <div className={styles.sidebarNote}>
          <Badge>Design preview</Badge>
          <p>
            Explore the dashboard with fictional data. Your next chapter starts
            with a clear view.
          </p>
        </div>
      </aside>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.brandGroup}>
            <IconButton
              ref={trigger}
              className={styles.menuTrigger}
              label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => (open ? closeMenu() : setOpen(true))}
            >
              <DashboardIcon name={open ? "close" : "menu"} />
            </IconButton>
            <p className={styles.wordmark}>
              Skill<span>Bridge</span>
              <small>Student dashboard</small>
            </p>
          </div>
          <div className={styles.search}>{search}</div>
          <div className={styles.headerTools}>
            <div className={styles.notifications}>
              <IconButton
                label="Notifications — unavailable in this preview"
                disabled
              >
                <DashboardIcon name="bell" />
              </IconButton>
              <span>Coming soon</span>
            </div>
            <div className={styles.identity}>
              <Avatar alt="" initials="AM" size="sm" />
              <div>
                <strong>{student.name}</strong>
                <p>{student.summary}</p>
              </div>
            </div>
          </div>
        </header>
        <div id="mobile-navigation" className={styles.mobilePanel}>
          {open && (
            <Navigation
              label="Mobile navigation"
              currentRef={mobileCurrent}
              onNavigate={closeMenu}
            />
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
