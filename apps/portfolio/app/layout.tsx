import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  title: "Huang Workspace",
  description: "Personal portfolio & blog of Tran Cong Hoang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col relative bg-[#0a0a0a] overflow-x-clip">
          <AnimatedBackground />

          {/* Top gradient glow */}
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none z-0" />

          <Header />

          <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 relative z-10">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
