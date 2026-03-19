"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-sm font-bold text-white group-hover:bg-zinc-700 transition-colors">
            HW
          </div>
          <span className="font-medium text-zinc-100 tracking-tight">
            huangwork.space
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link
            href="/"
            className={cn(
              "hover:text-zinc-100 transition-colors",
              pathname === "/" && "text-zinc-100"
            )}
          >
            Home
          </Link>
          <Link
            href="/videos"
            className={cn(
              "hover:text-zinc-100 transition-colors",
              pathname === "/videos" && "text-zinc-100"
            )}
          >
            Videos
          </Link>
          <Link
            href="/blog"
            className={cn(
              "hover:text-zinc-100 transition-colors",
              pathname.startsWith("/blog") && "text-zinc-100"
            )}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={cn(
              "hover:text-zinc-100 transition-colors",
              pathname === "/about" && "text-zinc-100"
            )}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
