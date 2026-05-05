import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import HeroFx from "@/components/HeroFx";

export const metadata: Metadata = {
  metadataBase: new URL("https://huangwork.space"),
  title: "Huang Workspace",
  description: "Personal portfolio & blog of Tran Cong Hoang",
  openGraph: {
    siteName: "Huang Workspace",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col relative overflow-x-clip">
          <AnimatedBackground />

          <HeroFx />

          <Header />

          <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 relative z-10">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
