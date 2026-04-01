import type { Profile } from "./types";
import profileData from "./generated/static/profile";

export function getProfile(): Profile {
  const d = profileData.data as Record<string, unknown>;
  const socials = (d.socials ?? {}) as Record<string, unknown>;

  return {
    name: String(d.name ?? ""),
    title: String(d.title ?? ""),
    email: String(d.email ?? ""),
    avatar: d.avatar ? String(d.avatar) : undefined,
    location: d.location ? String(d.location) : undefined,
    social: {
      github: socials.github ? String(socials.github) : undefined,
      facebook: socials.facebook ? String(socials.facebook) : undefined,
      linkedin: socials.linkedin ? String(socials.linkedin) : undefined,
      youtube: socials.youtube ? String(socials.youtube) : undefined,
    },
  };
}
