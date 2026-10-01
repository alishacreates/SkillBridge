import type {
  ApplicationStatus,
  LearningRecommendationCardProps,
  OpportunityCardProps,
  Skill,
} from "../skillbridge";

// Labels are documentation, never a second theme. Browser tests compare them with
// computed CSS values; every specimen is painted using styles/tokens.css.
export const brandColors = [
  {
    key: "primary",
    token: "--color-brand-primary",
    hex: "#540D6E",
    name: "Primary purple",
    usage: "Primary actions, links, and keyboard focus.",
  },
  {
    key: "accent",
    token: "--color-brand-accent",
    hex: "#EE4266",
    name: "Accent pink",
    usage: "Restrained decoration, not small text on light surfaces.",
  },
  {
    key: "highlight",
    token: "--color-brand-highlight",
    hex: "#FFD23F",
    name: "Highlight yellow",
    usage: "Highlights and selection with dark text.",
  },
  {
    key: "background",
    token: "--color-brand-background",
    hex: "#F3FCF0",
    name: "Pale green",
    usage: "The quiet canvas behind the workspace.",
  },
  {
    key: "dark",
    token: "--color-brand-dark",
    hex: "#1F271B",
    name: "Dark neutral",
    usage: "Headings, body copy, and important data.",
  },
] as const;
export const semanticColors = [
  { key: "success", hex: "#23653D", meaning: "Completed or positive outcomes" },
  { key: "warning", hex: "#795600", meaning: "Caution or attention needed" },
  { key: "error", hex: "#A3293D", meaning: "A problem with a recovery path" },
  { key: "info", hex: "#245B8A", meaning: "Informational context" },
] as const;
export const chartColors = [
  { key: "purple", name: "Purple", hex: "#632B80", value: 86 },
  { key: "pink", name: "Pink", hex: "#A83259", value: 72 },
  { key: "yellow", name: "Yellow", hex: "#806400", value: 65 },
  { key: "green", name: "Green", hex: "#287347", value: 58 },
  { key: "blue", name: "Blue", hex: "#2C5FA3", value: 49 },
  { key: "cyan", name: "Cyan", hex: "#186D7A", value: 38 },
  { key: "orange", name: "Orange", hex: "#A64F20", value: 26 },
] as const;
export const typeRoles = [
  "display",
  "h1",
  "h2",
  "h3",
  "body-lg",
  "body",
  "body-sm",
  "label",
  "caption",
] as const;
export const spaceScale = [1, 2, 3, 4, 6, 8, 12, 16] as const;
export const radiusScale = ["sm", "md", "lg", "xl", "full"] as const;
export const shadowScale = ["sm", "md", "lg"] as const;
export const layoutWidths = [
  {
    key: "content",
    token: "--layout-content-max",
    label: "Content · 90rem / 1440px",
  },
  {
    key: "shell",
    token: "--layout-shell-max",
    label: "Shell · 72rem / 1152px",
  },
  { key: "copy", token: "--layout-copy-max", label: "Copy · 38rem / 608px" },
  {
    key: "sidebar",
    token: "--layout-sidebar-width",
    label: "Sidebar · 15rem / 240px",
  },
] as const;
export const sectionLinks = [
  ["brand", "Brand colors"],
  ["semantic", "Semantic colors"],
  ["data-viz", "Data visualization"],
  ["typography", "Typography"],
  ["geometry", "Space, shape & layout"],
  ["primitives", "UI primitives"],
  ["domain", "SkillBridge components"],
  ["states", "Component states"],
  ["accessibility", "Accessibility"],
  ["architecture", "System architecture"],
] as const;
export const sampleSkills: readonly Skill[] = [
  { name: "React", proficiency: "INTERMEDIATE" },
  { name: "TypeScript", proficiency: "ADVANCED" },
  { name: "Git", proficiency: "ADVANCED", verified: true },
  { name: "Accessible interface engineering" },
];
export const applicationStatuses: readonly ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
];
export const sampleOpportunity: Omit<OpportunityCardProps, "action"> = {
  company: "Nova Labs · fictional",
  title:
    "Frontend Engineer Intern — accessible developer platforms and collaboration tools",
  location: "Bengaluru",
  workMode: "Hybrid",
  stipend: "₹25,000 / month",
  duration: "6 months",
  deadline: { dateTime: "2026-10-15", label: "15 October 2026" },
  requiredSkills: sampleSkills,
  matchScore: 94,
  applicationStatus: "SHORTLISTED",
  headingLevel: "h3",
};
export const sampleLearning: readonly Omit<
  LearningRecommendationCardProps,
  "action"
>[] = [
  {
    skill: "Jest",
    title: "Testing fundamentals",
    difficulty: "BEGINNER",
    priority: "HIGH",
    estimatedEffort: "3 hours",
  },
  {
    skill: "React",
    title: "Accessible component APIs",
    difficulty: "INTERMEDIATE",
    priority: "MEDIUM",
    estimatedEffort: "2 hours",
  },
  {
    skill: "Git",
    title: "Advanced collaboration",
    difficulty: "ADVANCED",
    priority: "LOW",
    estimatedEffort: "1 hour",
  },
];
