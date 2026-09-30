import type {
  ApplicationStatus,
  DashboardStatCardProps,
  DeadlineItemProps,
  LearningRecommendationCardProps,
  OpportunityCardProps,
  SkillProgressProps,
} from "../skillbridge";

export type SampleOpportunity = Omit<
  OpportunityCardProps,
  "action" | "headingLevel"
> & { id: string; description: string };
export type SampleLearning = Omit<
  LearningRecommendationCardProps,
  "action" | "headingLevel"
> & { id: string; topics: readonly string[] };

// Deliberately fixed, fictional snapshot. No clock, API, or matching algorithm is used.
export const student = {
  name: "Aarav Mehta",
  firstName: "Aarav",
  summary: "B.Tech · Computer Science",
  targetRole: "Frontend Engineer",
};
export const snapshot = { dateTime: "2026-09-23", label: "23 September 2026" };
export const metrics: readonly DashboardStatCardProps[] = [
  {
    label: "Profile Completion",
    value: "82%",
    context: "9 of 11 sections complete",
    accent: "chart-purple",
  },
  {
    label: "Strong Matches",
    value: 12,
    context: "Across 20 sample opportunities",
    accent: "success",
  },
  {
    label: "Applications",
    value: 7,
    context: "4 recent applications shown below",
    accent: "chart-blue",
  },
  {
    label: "Assessments Completed",
    value: 4,
    context: "A foundation to build on",
    accent: "chart-orange",
  },
];
export const readinessTrend = [
  { label: "2 Sep", value: 56 },
  { label: "9 Sep", value: 64 },
  { label: "16 Sep", value: 71 },
  { label: "23 Sep", value: 78 },
] as const;
export const matchDistribution = [
  { label: "Strong or better", range: "75–100%", count: 12, band: "strong" },
  { label: "Moderate match", range: "60–74%", count: 6, band: "moderate" },
  { label: "Low match", range: "Below 60%", count: 2, band: "low" },
] as const;
export const skills: readonly SkillProgressProps[] = [
  { skill: "TypeScript", current: "Advanced", percentage: 88 },
  { skill: "React", current: "Advanced", percentage: 85 },
  { skill: "Node.js", current: "Intermediate", percentage: 68 },
  { skill: "PostgreSQL", current: "Intermediate", percentage: 62 },
  { skill: "Git", current: "Advanced", percentage: 90 },
  { skill: "Docker", current: "Beginner", percentage: 35 },
];
export const opportunities: readonly SampleOpportunity[] = [
  {
    id: "nova-frontend",
    company: "Nova Labs",
    title: "Frontend Engineer Intern",
    location: "Bengaluru",
    workMode: "Hybrid",
    stipend: "₹25,000 / month",
    duration: "6 months",
    deadline: { dateTime: "2026-09-26", label: "26 September 2026" },
    requiredSkills: [
      { name: "React" },
      { name: "TypeScript" },
      { name: "CSS" },
    ],
    matchScore: 94,
    applicationStatus: "APPLIED",
    description:
      "A fictional internship building accessible interfaces for a collaborative developer workspace. Practise reusable components, responsive layouts, and thoughtful code reviews. This is sample content, not an active vacancy.",
  },
  {
    id: "orbit-software",
    company: "Orbit Systems",
    title: "Software Engineer Intern",
    location: "Pune",
    workMode: "Remote",
    stipend: "₹22,000 / month",
    duration: "4 months",
    deadline: { dateTime: "2026-10-02", label: "2 October 2026" },
    requiredSkills: [
      { name: "TypeScript" },
      { name: "Node.js" },
      { name: "Git" },
    ],
    matchScore: 86,
    applicationStatus: "UNDER_REVIEW",
    description:
      "A fictional team working on internal productivity tools. The sample role combines TypeScript services, debugging, and small end-to-end features. No application can be submitted from this preview.",
  },
  {
    id: "northstar-fullstack",
    company: "Northstar Technologies",
    title: "Full Stack Developer Intern",
    location: "Hyderabad",
    workMode: "On-site",
    stipend: "₹30,000 / month",
    duration: "6 months",
    deadline: { dateTime: "2026-10-08", label: "8 October 2026" },
    requiredSkills: [
      { name: "React" },
      { name: "PostgreSQL" },
      { name: "Docker" },
      { name: "API design" },
    ],
    matchScore: 72,
    description:
      "A fictional opportunity connecting user interfaces with relational data. The sample responsibilities include reviewing API contracts, testing data flows, and learning container workflows. This is not a live job posting.",
  },
];
export const learning: readonly SampleLearning[] = [
  {
    id: "jest",
    skill: "Jest",
    title: "Jest testing fundamentals",
    difficulty: "BEGINNER",
    priority: "HIGH",
    estimatedEffort: "3 hours",
    topics: [
      "Arrange, act, assert",
      "Test behaviour rather than implementation",
      "Understand test doubles",
    ],
  },
  {
    id: "cypress",
    skill: "Cypress",
    title: "Cypress end-to-end testing",
    difficulty: "INTERMEDIATE",
    priority: "HIGH",
    estimatedEffort: "4 hours",
    topics: [
      "Write a user journey",
      "Use accessible selectors",
      "Keep browser tests deterministic",
    ],
  },
  {
    id: "redux",
    skill: "Redux",
    title: "Redux Toolkit",
    difficulty: "INTERMEDIATE",
    priority: "MEDIUM",
    estimatedEffort: "3 hours",
    topics: [
      "Decide when shared state is necessary",
      "Understand slices and selectors",
      "Avoid duplicating derived data",
    ],
  },
  {
    id: "performance",
    skill: "Web Performance",
    title: "Web performance basics",
    difficulty: "BEGINNER",
    priority: "LOW",
    estimatedEffort: "2 hours",
    topics: [
      "Measure before optimising",
      "Reduce layout shifts",
      "Understand asset loading",
    ],
  },
];
export const applications: readonly {
  id: string;
  title: string;
  company: string;
  status: ApplicationStatus;
  date: string;
}[] = [
  {
    id: "a1",
    title: "Frontend Engineer Intern",
    company: "Nova Labs",
    status: "APPLIED",
    date: "22 Sep",
  },
  {
    id: "a2",
    title: "Software Engineer Intern",
    company: "Orbit Systems",
    status: "UNDER_REVIEW",
    date: "20 Sep",
  },
  {
    id: "a3",
    title: "UI Engineering Intern",
    company: "Cedar Studio",
    status: "SHORTLISTED",
    date: "18 Sep",
  },
  {
    id: "a4",
    title: "Product Engineering Intern",
    company: "Lumen Works",
    status: "INTERVIEW",
    date: "16 Sep",
  },
];
export const deadlines: readonly (DeadlineItemProps & { id: string })[] = [
  {
    id: "interview",
    title: "Product engineering conversation",
    context: "Lumen Works · Sample event",
    type: "Interview / event",
    date: {
      dateTime: "2026-09-24T14:00:00+05:30",
      label: "24 Sep · 2:00 PM IST",
    },
    urgency: "soon",
  },
  {
    id: "assessment",
    title: "JavaScript foundations",
    context: "Sample skill assessment",
    type: "Assessment deadline",
    date: { dateTime: "2026-09-25", label: "25 September 2026" },
    urgency: "soon",
  },
  {
    id: "application",
    title: "Frontend Engineer Intern",
    context: "Nova Labs",
    type: "Application deadline",
    date: { dateTime: "2026-09-26", label: "26 September 2026" },
    urgency: "upcoming",
  },
];
