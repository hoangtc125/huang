import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import ShootingStars from "@/components/ShootingStars";

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

          {/* Shooting stars — hero zone only */}
          <div className="absolute top-0 left-0 right-0 h-[520px] pointer-events-none z-1 overflow-hidden">
            <ShootingStars />
          </div>

          {/* Top gradient glow */}
          <div className="absolute top-0 left-0 right-0 h-[520px] bg-gradient-to-b from-rose-300/10 via-transparent to-transparent pointer-events-none z-0" />

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
