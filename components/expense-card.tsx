"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Check, Trash2, Calendar, FileText, Bell, Clock, Repeat } from "lucide-react";
import { calculateDaysRemaining, ExpenseStatus } from "@/lib/business-logic";
import { cn } from "@/lib/utils";

export interface ExpenseCardProps {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: ExpenseStatus;
  dueDate: Date;
  paidAt?: Date | null;
  category?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
  hasDocument?: boolean;
  isRecurring?: boolean;
  recurrenceType?: string | null;
  alarmTriggered?: boolean;
  onMarkAsPaid?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

const SWIPE_THRESHOLD = -100;

export function ExpenseCard({
  id,
  title,
  amount,
  currency,
  status,
  dueDate,
  paidAt,
  category,
  hasDocument,
  isRecurring,
  recurrenceType,
  alarmTriggered,
  onMarkAsPaid,
  onDelete,
  onClick,
}: ExpenseCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  const opacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const bgOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const scale = useTransform(x, [0, SWIPE_THRESHOLD], [0.8, 1]);

  const daysInfo = calculateDaysRemaining({
    id,
    status,
    dueDate,
    paidAt,
    amount,
  });

  const handleDragEnd = useCallback(
    (event: any, info: any) => {
      setIsDragging(false);
      
      if (info.offset.x < SWIPE_THRESHOLD) {
        // Swiped far enough - mark as paid
        onMarkAsPaid?.(id);
      }
    },
    [id, onMarkAsPaid]
  );

  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-CL", {
      day: "numeric",
      month: "short",
    }).format(new Date(date));
  };

  const getStatusGlow = () => {
    if (status === "paid") return "glow-paid";
    if (status === "overdue") return "glow-overdue";
    if (status === "upcoming") return "glow-upcoming";
    return "";
  };

  const getAmountClass = () => {
    switch (status) {
      case "paid":
        return "amount-paid";
      case "overdue":
        return "amount-overdue";
      case "upcoming":
        return "amount-upcoming";
      default:
        return "amount-pending";
    }
  };

  const getStatusBadgeClass = () => {
    switch (status) {
      case "paid":
        return "status-badge-paid";
      case "overdue":
        return "status-badge-overdue";
      case "upcoming":
        return "status-badge-upcoming";
      default:
        return "status-badge-pending";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "paid":
        return "Pagado";
      case "overdue":
        return "Atrasado";
      case "upcoming":
        return "Próximo";
      default:
        return "Pendiente";
    }
  };

  return (
    <div ref={constraintsRef} className="swipe-container relative mb-3">
      {/* Background Actions */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-end rounded-2xl overflow-hidden"
        style={{ opacity: bgOpacity }}
      >
        <motion.div
          className="swipe-action-paid h-full flex items-center px-6 gap-2"
          style={{ scale }}
        >
          <Check className="w-6 h-6 text-white" />
          <span className="text-white font-medium">Marcar Pagado</span>
        </motion.div>
      </motion.div>

      {/* Card Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: SWIPE_THRESHOLD, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ scale: isDragging ? 1 : 0.98 }}
        className={cn(
          "swipe-content card-premium card-premium-hover p-4 cursor-pointer micro-bounce",
          getStatusGlow()
        )}
        onClick={() => !isDragging && onClick?.(id)}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: Icon & Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Category Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: category?.color
                  ? `${category.color}20`
                  : "rgba(148, 163, 184, 0.2)",
                color: category?.color || "#94a3b8",
              }}
            >
              <span className="text-xl">{category?.icon || "📄"}</span>
            </div>

            {/* Title & Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate pr-2">
                {title}
              </h3>
              
              {/* Meta row */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={getStatusBadgeClass()}>
                  {getStatusLabel()}
                </span>
                
                {/* Date indicator */}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(dueDate)}
                </span>

                {/* Recurring badge */}
                {isRecurring && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    {recurrenceType === "monthly" && "Mensual"}
                    {recurrenceType === "yearly" && "Anual"}
                    {recurrenceType === "weekly" && "Semanal"}
                    {!recurrenceType && "Recurrente"}
                  </span>
                )}

                {/* Document indicator */}
                {hasDocument && (
                  <FileText className="w-3 h-3 text-muted-foreground" />
                )}

                {/* Alarm indicator */}
                {alarmTriggered && (
                  <Bell className="w-3 h-3 text-status-upcoming" />
                )}
              </div>

              {/* Days remaining message */}
              {status !== "paid" && (
                <p
                  className={cn(
                    "text-xs mt-1.5",
                    daysInfo.alarmLevel === "critical" && "text-status-overdue",
                    daysInfo.alarmLevel === "warning" && "text-status-upcoming",
                    daysInfo.alarmLevel === "info" && "text-muted-foreground",
                    daysInfo.alarmLevel === "none" && "text-muted-foreground"
                  )}
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  {daysInfo.message}
                </p>
              )}
            </div>
          </div>

          {/* Right: Amount */}
          <div className="text-right shrink-0">
            <p className={cn("text-lg font-bold", getAmountClass())}>
              {formatCurrency(amount, currency)}
            </p>
            
            {/* Swipe hint */}
            {status !== "paid" && (
              <p className="text-[10px] text-muted-foreground mt-1">
                ← Deslizar para pagar
              </p>
            )}
          </div>
        </div>

        {/* Progress indicator for swipe */}
        {status !== "paid" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ opacity: bgOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
}

// Compact version for lists
export function ExpenseCardCompact({
  id,
  title,
  amount,
  currency,
  status,
  dueDate,
  category,
  onClick,
}: Omit<ExpenseCardProps, "onMarkAsPaid" | "onDelete">) {
  const daysInfo = calculateDaysRemaining({
    id,
    status,
    dueDate,
    amount,
  });

  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border border-white/[0.08] bg-card/50 cursor-pointer micro-bounce",
        status === "overdue" && "glow-overdue"
      )}
      onClick={() => onClick?.(id)}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{
            backgroundColor: category?.color
              ? `${category.color}20`
              : "rgba(148, 163, 184, 0.2)",
          }}
        >
          {category?.icon || "📄"}
        </div>
        <div>
          <p className="font-medium text-sm text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{daysInfo.message}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "font-semibold",
            status === "paid" && "amount-paid",
            status === "overdue" && "amount-overdue",
            status === "upcoming" && "amount-upcoming",
            status === "pending" && "amount-pending"
          )}
        >
          {formatCurrency(amount, currency)}
        </p>
      </div>
    </motion.div>
  );
}
