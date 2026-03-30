"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface Props {
  type: "blog" | "project" | "video";
  slug: string;
  className?: string;
}

export default function ViewCounter({ type, slug, className }: Props) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Fire-and-forget: increment view count, then display the result
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === "number") setViews(data.views);
      })
      .catch(() => {
        // Fallback: try GET if POST fails
        fetch(`/api/views?type=${type}&slug=${slug}`)
          .then((res) => res.json())
          .then((data) => {
            if (typeof data.views === "number") setViews(data.views);
          })
          .catch(() => {});
      });
  }, [type, slug]);

  if (views === null) return null;

  return (
    <span className={className ?? "flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]"}>
      <Eye className="w-3.5 h-3.5" />
      {views.toLocaleString()} views
    </span>
  );
}
