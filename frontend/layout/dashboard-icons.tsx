export type DashboardIconName =
  | "dashboard"
  | "opportunities"
  | "assessment"
  | "gaps"
  | "applications"
  | "profile"
  | "search"
  | "bell"
  | "menu"
  | "close"
  | "arrow";
const paths: Record<DashboardIconName, string> = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  opportunities: "M8 6V3h8v3 M3 6h18v15H3z M3 11h18 M10 11v3h4v-3",
  assessment: "M7 3h10v3H7z M7 4H4v17h16V4h-3 M8 11l2 2 5-5 M8 17h8",
  gaps: "M4 19h16 M6 15v-3 M12 15V8 M18 15V4",
  applications: "M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h7",
  profile: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0 M15 15l6 6",
  bell: "M6 9a6 6 0 0 1 12 0v6l2 3H4l2-3z M10 21h4",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  close: "M6 6l12 12 M18 6 6 18",
  arrow: "M5 12h14 M13 6l6 6-6 6",
};
export function DashboardIcon({ name }: { name: DashboardIconName }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
