import type { Metadata } from "next";
import { getProjects } from "@/lib/content/projects";
import HomeClient from "./HomeClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Huang Workspace — Software Engineer & Content Creator",
  description:
    "Personal portfolio of Tran Cong Hoang — software engineer specializing in React, Next.js, and mobile development.",
  openGraph: {
    title: "Huang Workspace",
    description:
      "Personal portfolio of Tran Cong Hoang — software engineer specializing in React, Next.js, and mobile development.",
    type: "website",
  },
};

export default function HomePage() {
  const projects = getProjects();
  return <HomeClient projects={projects} />;
}
