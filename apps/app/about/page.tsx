import type { Metadata } from "next";
import { getQAs } from "@/lib/content/qa";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About | Huang Workspace",
  description:
    "About Tran Cong Hoang — software engineer, career journey, Q&A, and how to connect.",
};

export default function AboutPage() {
  const qas = getQAs();
  return <AboutClient qas={qas} />;
}
