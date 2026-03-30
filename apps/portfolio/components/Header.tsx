"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/videos", label: "Videos", exact: true },
  { href: "/blog", label: "Blog", exact: false },
  { href: "/about", label: "About", exact: true },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (link: (typeof NAV_LINKS)[number]) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border)/0.45)] bg-[hsl(var(--background)/0.75)] backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between max-w-6xl">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <img
              src="/images/ava.jpg"
              alt="HW"
              className="w-8 h-8 rounded object-cover shadow-sm ring-1 ring-white/10 group-hover:ring-white/25 transition-all"
            />
            <span className="font-medium text-[hsl(var(--foreground))] tracking-tight">
              huangwork.space
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "hover:text-[hsl(var(--foreground))] transition-colors",
                  isActive(link) && "text-[hsl(var(--foreground))]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="sm:hidden p-2 -mr-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown overlay */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "sm:hidden fixed top-14 right-4 z-50 w-48 rounded-xl border border-[hsl(var(--border)/0.45)] bg-[hsl(var(--background)/0.95)] backdrop-blur-md shadow-xl transition-all duration-200 origin-top-right",
          mobileOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <nav className="flex flex-col p-2 gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(link)
                  ? "text-[hsl(var(--foreground))] bg-[hsl(var(--card)/0.5)]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card)/0.3)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
