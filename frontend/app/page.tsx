import type { Metadata } from "next";
import { StudentDashboard } from "../components/dashboard/student-dashboard";

export const metadata: Metadata = {
  title: "Student Dashboard — SkillBridge",
  description:
    "A representative SkillBridge student dashboard. Explore sample skills, opportunities, and learning pathways; no live account or API is connected.",
};

export default function HomePage() {
  return <StudentDashboard />;
}
