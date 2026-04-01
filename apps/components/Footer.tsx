import { Mail } from "lucide-react";
import { getProfile } from "@/lib/content";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const profile = getProfile();

  return (
    <footer className="border-t border-[hsl(var(--border)/0.45)] py-8 mt-12 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact me
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Huang Workspace. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {profile.social.facebook && (
            <a
              href={profile.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
