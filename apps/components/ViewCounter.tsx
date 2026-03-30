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
    const controller = new AbortController();

    fetch(`/api/views?type=${type}&slug=${slug}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.views === "number") {
          setViews(data.views);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [type, slug]);

  if (views === null) return null;

  return (
    <span
      className={
        className ??
        "flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]"
      }
    >
      <Eye className="w-3.5 h-3.5" />
      {views.toLocaleString()} views
    </span>
  );
}
