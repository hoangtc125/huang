export type ViewResourceType = "blog" | "project" | "video";

export interface ViewTarget {
  type: ViewResourceType;
  slug: string;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function resolveViewTargetFromPathname(pathname: string): ViewTarget | null {
  const path = pathname.trim();

  let match = path.match(/^\/blog\/([a-z0-9-]+)\/?$/);
  if (match) {
    return buildTarget("blog", match[1]);
  }

  match = path.match(/^\/project\/([a-z0-9-]+)\/?$/);
  if (match) {
    return buildTarget("project", match[1]);
  }

  match = path.match(/^\/videos\/([a-z0-9-]+)\/?$/);
  if (match) {
    return buildTarget("video", match[1]);
  }

  return null;
}

function buildTarget(type: ViewResourceType, slug: string): ViewTarget | null {
  if (!slug || slug.length > 200 || !SLUG_RE.test(slug)) {
    return null;
  }
  return { type, slug };
}

