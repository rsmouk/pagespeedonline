import Link from "next/link";
import { cn } from "@/lib/cn";

const navIconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";

interface NavIconLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Icon-sized nav control on mobile; expands with label on sm+ */
export function NavIconLink({
  href,
  label,
  children,
  className,
}: NavIconLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        navIconButtonClass,
        "sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2 sm:text-sm sm:font-medium",
        className
      )}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export { navIconButtonClass };
