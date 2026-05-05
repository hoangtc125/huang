import type { Metadata } from "next";
import CvViewer from "./CvViewer";

export const dynamic = "force-static";

const PDF_URL = "/files/CV_TRAN_CONG_HOANG.pdf";

export const metadata: Metadata = {
  title: "CV | Huang Workspace",
  description: "Curriculum Vitae — Tran Cong Hoang",
  openGraph: {
    title: "CV — Tran Cong Hoang",
    description: "Curriculum Vitae",
    type: "profile",
  },
};

export default function CvPage() {
  return <CvViewer fileUrl={PDF_URL} fileName="CV_TRAN_CONG_HOANG.pdf" />;
}
