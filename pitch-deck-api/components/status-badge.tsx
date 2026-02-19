import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  archived: "bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", statusStyles[status] || statusStyles.draft)}
    >
      {status}
    </Badge>
  )
}
