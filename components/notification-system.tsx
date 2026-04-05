"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Clock, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateDaysRemaining, ExpenseStatus } from "@/lib/business-logic";

export interface Notification {
  id: string;
  type: "seven_days" | "forty_eight_hours" | "same_day" | "overdue" | "payment_confirmed";
  title: string;
  message: string;
  expenseId: string;
  expenseTitle: string;
  amount: number;
  currency: string;
  dueDate: Date;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationSystemProps {
  expenses: {
    id: string;
    title: string;
    amount: number;
    currency: string;
    status: ExpenseStatus;
    dueDate: Date;
    paidAt?: Date | null;
  }[];
  onNotificationClick?: (expenseId: string) => void;
  onMarkAsPaid?: (expenseId: string) => void;
}

export function NotificationSystem({
  expenses,
  onNotificationClick,
  onMarkAsPaid,
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Generar notificaciones basadas en los gastos
  useEffect(() => {
    const now = new Date();
    const newNotifications: Notification[] = [];

    expenses.forEach((expense) => {
      if (expense.status === "paid") return;

      const daysInfo = calculateDaysRemaining({
        id: expense.id,
        status: expense.status,
        dueDate: expense.dueDate,
        paidAt: expense.paidAt,
        amount: expense.amount,
      });

      // Crear notificación según el nivel de alarma
      if (expense.status === "overdue") {
        newNotifications.push({
          id: `overdue-${expense.id}`,
          type: "overdue",
          title: "Pago atrasado",
          message: `${expense.title} venció hace ${Math.abs(daysInfo.days)} días`,
          expenseId: expense.id,
          expenseTitle: expense.title,
          amount: expense.amount,
          currency: expense.currency,
          dueDate: expense.dueDate,
          isRead: false,
          createdAt: now,
        });
      } else if (daysInfo.days === 0) {
        newNotifications.push({
          id: `today-${expense.id}`,
          type: "same_day",
          title: "Vence hoy",
          message: `${expense.title} vence hoy`,
          expenseId: expense.id,
          expenseTitle: expense.title,
          amount: expense.amount,
          currency: expense.currency,
          dueDate: expense.dueDate,
          isRead: false,
          createdAt: now,
        });
      } else if (daysInfo.days === 1) {
        newNotifications.push({
          id: `tomorrow-${expense.id}`,
          type: "forty_eight_hours",
          title: "Vence mañana",
          message: `${expense.title} vence mañana`,
          expenseId: expense.id,
          expenseTitle: expense.title,
          amount: expense.amount,
          currency: expense.currency,
          dueDate: expense.dueDate,
          isRead: false,
          createdAt: now,
        });
      } else if (daysInfo.days <= 7) {
        newNotifications.push({
          id: `week-${expense.id}`,
          type: "seven_days",
          title: "Próximo vencimiento",
          message: `${expense.title} vence en ${daysInfo.days} días`,
          expenseId: expense.id,
          expenseTitle: expense.title,
          amount: expense.amount,
          currency: expense.currency,
          dueDate: expense.dueDate,
          isRead: false,
          createdAt: now,
        });
      }
    });

    // Ordenar por prioridad: atrasados primero, luego por días
    newNotifications.sort((a, b) => {
      const priorityOrder = {
        overdue: 0,
        same_day: 1,
        forty_eight_hours: 2,
        seven_days: 3,
        payment_confirmed: 4,
      };
      return priorityOrder[a.type] - priorityOrder[b.type];
    });

    setNotifications(newNotifications);
    setHasUnread(newNotifications.some((n) => !n.isRead));
  }, [expenses]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setHasUnread(false);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    onNotificationClick?.(notification.expenseId);
    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "same_day":
        return <Clock className="w-5 h-5 text-amber-400" />;
      case "forty_eight_hours":
        return <Clock className="w-5 h-5 text-amber-400" />;
      case "seven_days":
        return <Bell className="w-5 h-5 text-blue-400" />;
      case "payment_confirmed":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationStyle = (type: Notification["type"]) => {
    switch (type) {
      case "overdue":
        return "bg-red-500/10 border-red-500/30";
      case "same_day":
      case "forty_eight_hours":
        return "bg-amber-500/10 border-amber-500/30";
      case "seven_days":
        return "bg-blue-500/10 border-blue-500/30";
      case "payment_confirmed":
        return "bg-emerald-500/10 border-emerald-500/30";
      default:
        return "bg-secondary";
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      {/* Notification Bell Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {hasUnread && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"
          />
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 bg-background border-l border-white/[0.08] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Notificaciones
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {notifications.length} pendientes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasUnread && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Marcar todo
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto h-[calc(100vh-80px)] p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-primary/50" />
                    </div>
                    <h3 className="font-medium text-foreground">
                      Sin notificaciones
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      No tienes pagos pendientes
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]",
                        getNotificationStyle(notification.type),
                        !notification.isRead && "ring-1 ring-white/10"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-foreground text-sm">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                notification.type === "overdue"
                                  ? "text-red-400"
                                  : notification.type === "same_day" ||
                                    notification.type === "forty_eight_hours"
                                  ? "text-amber-400"
                                  : "text-foreground"
                              )}
                            >
                              {formatCurrency(
                                notification.amount,
                                notification.currency
                              )}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>

                          {/* Quick Actions */}
                          {(notification.type === "overdue" ||
                            notification.type === "same_day") && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsPaid?.(notification.expenseId);
                                markAsRead(notification.id);
                              }}
                              className="mt-3 w-full py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                            >
                              Marcar como pagado
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Toast Notification Component
export function ToastNotification({
  notification,
  onClose,
  onAction,
}: {
  notification: Notification;
  onClose: () => void;
  onAction?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        "fixed bottom-4 left-4 right-4 max-w-sm mx-auto p-4 rounded-2xl shadow-2xl z-50",
        notification.type === "overdue"
          ? "bg-red-500/20 border border-red-500/50"
          : notification.type === "same_day"
          ? "bg-amber-500/20 border border-amber-500/50"
          : "bg-primary/20 border border-primary/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            notification.type === "overdue"
              ? "bg-red-500/30"
              : notification.type === "same_day"
              ? "bg-amber-500/30"
              : "bg-primary/30"
          )}
        >
          {notification.type === "overdue" ? (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          ) : notification.type === "same_day" ? (
            <Clock className="w-5 h-5 text-amber-400" />
          ) : (
            <Bell className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{notification.title}</h4>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-sm text-primary font-medium hover:underline"
            >
              Ver detalle →
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
