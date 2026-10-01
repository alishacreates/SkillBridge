import type { Metadata } from "next";
import { DesignShowcase } from "../../components/design/design-showcase";

export const metadata: Metadata = {
  title: "Design System — SkillBridge",
  description:
    "Explore SkillBridge’s production design tokens, UI primitives, domain components, and accessibility-aware interaction examples.",
};

export default function DesignPage() {
  return <DesignShowcase />;
}
