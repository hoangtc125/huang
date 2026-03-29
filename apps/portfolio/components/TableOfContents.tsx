import { cn } from "@/lib/utils";

export type TocItem = { id: string; text: string; level: 2 | 3 };

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-3">
      <div className="text-xs font-semibold tracking-wide uppercase text-[hsl(var(--muted-foreground))]">
        Mục lục
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id} className={cn(it.level === 3 && "pl-3")}>
            <a
              href={`#${it.id}`}
              className={cn(
                "block leading-snug text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors",
                it.level === 2 && "font-medium"
              )}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

