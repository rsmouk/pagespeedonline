"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/", label: "Lighthouse" },
  { href: "/headers", label: "Header Compare" },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/" || pathname.startsWith("/compare")
            : pathname.startsWith("/headers");

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
