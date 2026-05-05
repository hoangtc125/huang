"use client";

import { usePathname } from "next/navigation";
import ShootingStars from "./ShootingStars";

const HIDDEN_ROUTES = ["/cv"];

export default function HeroFx() {
  const pathname = usePathname();
  if (HIDDEN_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[520px] pointer-events-none z-1 overflow-hidden">
        <ShootingStars />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[520px] bg-gradient-to-b from-rose-300/10 via-transparent to-transparent pointer-events-none z-0" />
    </>
  );
}
