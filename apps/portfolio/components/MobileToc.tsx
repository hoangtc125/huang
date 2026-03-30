"use client";

import { useState } from "react";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import TableOfContents, { type TocItem } from "./TableOfContents";

export default function MobileToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  if (!items.length) return null;

  return (
    <>
      {/* Floating button — bottom right */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[hsl(var(--card)/0.85)] border border-[hsl(var(--border)/0.45)] backdrop-blur-md text-sm font-medium text-[hsl(var(--foreground))] shadow-xl"
        aria-label="Toggle table of contents"
      >
        {open ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
        Mục lục
      </button>

      {/* Backdrop blur overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-[hsl(var(--background)/0.5)] backdrop-blur-sm transition-all duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* TOC panel — bottom right, above the button */}
      <div
        className={cn(
          "lg:hidden fixed bottom-20 right-6 z-50 w-[min(20rem,calc(100vw-3rem))] rounded-2xl border border-[hsl(var(--border)/0.45)] bg-[hsl(var(--card)/0.92)] backdrop-blur-xl shadow-2xl transition-all duration-300 origin-bottom-right",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        )}
      >
        <div className="p-4 max-h-[60vh] overflow-y-auto overscroll-contain toc-scrollbar" onClick={() => setOpen(false)}>
          <TableOfContents items={items} />
        </div>
      </div>
    </>
  );
}
