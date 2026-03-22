import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Topic } from "@/lib/content/types";

const TOPIC_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
};

interface Props {
  topic: Topic;
  asLink?: boolean;
  className?: string;
}

export default function TopicBadge({ topic, asLink = true, className }: Props) {
  const colorCls = TOPIC_COLORS[topic.color] ?? TOPIC_COLORS.indigo;

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors",
        colorCls,
        className
      )}
    >
      {topic.icon && <span>{topic.icon}</span>}
      {topic.title}
    </span>
  );

  if (asLink) {
    return (
      <Link href={`/topics/${topic.slug}`} className="inline-flex">
        {badge}
      </Link>
    );
  }

  return badge;
}
