import { formatScore, scoreColorClass } from "@/lib/formatters";
import { cn } from "@/lib/cn";

interface ScoreRingProps {
  score: number | null | undefined;
  label: string;
  delta?: number | null;
  size?: "sm" | "md" | "lg";
}

export function ScoreRing({ score, label, delta, size = "md" }: ScoreRingProps) {
  const pct = score != null ? Math.round(score * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (pct / 100) * circumference;

  const sizeClasses = {
    sm: "h-16 w-16 text-lg",
    md: "h-24 w-24 text-2xl",
    lg: "h-28 w-28 text-3xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-200 dark:text-slate-700"
          />
          {score != null && (
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={scoreColorClass(score)}
            />
          )}
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold",
            scoreColorClass(score)
          )}
        >
          {formatScore(score)}
        </span>
      </div>
      <span className="text-center text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {delta != null && delta !== 0 && (
        <span
          className={cn(
            "text-xs font-medium",
            delta > 0 ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {delta > 0 ? "+" : ""}
          {delta} vs other
        </span>
      )}
    </div>
  );
}
