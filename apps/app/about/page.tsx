import type { Metadata } from "next";
import { getQAs } from "@/lib/content/qa";
import { getExperience } from "@/lib/content/experience";
import { getProfile } from "@/lib/content/profile";
import { getAboutContent } from "@/lib/content/about";
import { markdownToHtml } from "@/lib/content";
import AboutClient from "./AboutClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About | Huang Workspace",
  description:
    "About Tran Cong Hoang — software engineer, career journey, Q&A, and how to connect.",
};

export default async function AboutPage() {
  const [qas, experience, profile, bioHtml] = await Promise.all([
    Promise.resolve(getQAs()),
    Promise.resolve(getExperience()),
    Promise.resolve(getProfile()),
    markdownToHtml(getAboutContent()),
  ]);
  return <AboutClient qas={qas} experience={experience} profile={profile} bioHtml={bioHtml} />;
}
