"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; text: string; level: 2 | 3 };

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  // Scroll-based active heading detection — robust against layout shifts
  useEffect(() => {
    if (!items.length) return;

    function updateActive() {
      const OFFSET = 100; // px below top of viewport to consider "active"
      let currentId = items[0]?.id ?? "";

      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        // getBoundingClientRect is always correct regardless of DOM nesting
        const top = el.getBoundingClientRect().top;
        if (top <= OFFSET) {
          currentId = it.id;
        } else {
          break; // headings are in document order, no need to check further
        }
      }

      setActiveId(currentId);
    }

    // Run on mount
    updateActive();

    // Throttled scroll handler
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  // Auto-scroll TOC list to keep active item visible
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const li = itemRefs.current.get(activeId);
    if (!li) return;

    const container = listRef.current;
    const liTop = li.offsetTop - container.offsetTop;
    const liBottom = liTop + li.offsetHeight;
    const scrollTop = container.scrollTop;
    const viewHeight = container.clientHeight;

    if (liBottom > scrollTop + viewHeight - 8) {
      container.scrollTo({ top: liBottom - viewHeight + 8, behavior: "smooth" });
    } else if (liTop < scrollTop + 8) {
      container.scrollTo({ top: Math.max(0, liTop - 8), behavior: "smooth" });
    }
  }, [activeId]);

  const setItemRef = useCallback(
    (id: string) => (el: HTMLLIElement | null) => {
      if (el) itemRefs.current.set(id, el);
      else itemRefs.current.delete(id);
    },
    []
  );

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-3">
      <div className="text-xs font-semibold tracking-wide uppercase text-[hsl(var(--muted-foreground))]">
        Mục lục
      </div>
      <ul
        ref={listRef}
        className="space-y-1 text-sm max-h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain toc-scrollbar"
      >
        {items.map((it) => {
          const isActive = activeId === it.id;
          return (
            <li
              key={it.id}
              ref={setItemRef(it.id)}
              className={cn("relative", it.level === 3 && "pl-3")}
            >
              <a
                href={`#${it.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(it.id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                    setActiveId(it.id);
                    history.replaceState(null, "", `#${it.id}`);
                  }
                }}
                className={cn(
                  "block py-1.5 pl-3 border-l-2 leading-snug transition-all duration-200",
                  isActive
                    ? "border-rose-400 text-[hsl(var(--foreground))] font-medium"
                    : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--border))]"
                )}
              >
                {it.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
