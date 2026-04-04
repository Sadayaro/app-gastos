import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
  {
    variants: {
      status: {
        pending: "bg-[var(--status-pending-bg)] text-[var(--status-pending)] border-[var(--status-pending)]/30",
        assigned: "bg-[var(--status-assigned-bg)] text-[var(--status-assigned)] border-[var(--status-assigned)]/30",
        paid: "bg-[var(--status-paid-bg)] text-[var(--status-paid)] border-[var(--status-paid)]/30",
        alert: "bg-[var(--status-alert-bg)] text-[var(--status-alert)] border-[var(--status-alert)]/30",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

const statusConfig = {
  pending: { label: "Pendiente", icon: "●" },
  assigned: { label: "Dinero Asignado", icon: "◐" },
  paid: { label: "Pagado", icon: "✓" },
  alert: { label: "Vencido", icon: "⚠" },
}

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  className?: string
  showIcon?: boolean
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status || "pending"]
  
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {showIcon && <span className="text-[10px]">{config.icon}</span>}
      {config.label}
    </span>
  )
}
