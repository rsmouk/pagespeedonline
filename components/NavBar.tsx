"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/", label: "Lighthouse" },
  { href: "/headers", label: "Header Compare" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/" || pathname.startsWith("/compare")
    : pathname.startsWith("/headers");
}

function linkClass(pathname: string, href: string) {
  return cn(
    "block px-3 py-2 text-sm font-medium transition",
    isActive(pathname, href)
      ? "text-teal-600 dark:text-teal-400"
      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
  );
}

export function NavBarDesktop() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-4 md:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={linkClass(pathname, link.href)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function NavBarMobile() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-slate-600 dark:text-slate-300"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
          <div className="absolute start-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(pathname, link.href)}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
