import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

const variants = {
  default: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  muted: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
