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

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/compare")
      : pathname.startsWith("/headers");

  const linkClass = (href: string) =>
    cn(
      "block rounded-lg px-3 py-2.5 text-sm font-medium transition",
      isActive(href)
        ? "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    );

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass(link.href)}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
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
            <div className="absolute end-4 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
