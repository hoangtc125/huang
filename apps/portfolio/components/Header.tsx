"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border)/0.45)] bg-[hsl(var(--background)/0.75)] backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-rose-300/90 to-amber-300/70 flex items-center justify-center text-sm font-bold text-[#2b1216] shadow-sm ring-1 ring-white/5 group-hover:from-rose-200 group-hover:to-amber-200 transition-colors">
            HW
          </div>
          <span className="font-medium text-[hsl(var(--foreground))] tracking-tight">
            huangwork.space
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-[hsl(var(--muted-foreground))]">
          <Link
            href="/"
            className={cn(
              "hover:text-[hsl(var(--foreground))] transition-colors",
              pathname === "/" && "text-[hsl(var(--foreground))]"
            )}
          >
            Home
          </Link>
          <Link
            href="/videos"
            className={cn(
              "hover:text-[hsl(var(--foreground))] transition-colors",
              pathname === "/videos" && "text-[hsl(var(--foreground))]"
            )}
          >
            Videos
          </Link>
          <Link
            href="/blog"
            className={cn(
              "hover:text-[hsl(var(--foreground))] transition-colors",
              pathname.startsWith("/blog") && "text-[hsl(var(--foreground))]"
            )}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={cn(
              "hover:text-[hsl(var(--foreground))] transition-colors",
              pathname === "/about" && "text-[hsl(var(--foreground))]"
            )}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
