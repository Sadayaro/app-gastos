"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  Filter,
  Plus,
  Receipt,
  Home,
  Zap,
  GraduationCap,
  Gamepad2,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { ExpenseCard, ExpenseCardCompact } from "./expense-card";
import { ExpenseStatus, calculateMonthlySummary, filterExpenses } from "@/lib/business-logic";
import { cn } from "@/lib/utils";

// Categorías por defecto
const DEFAULT_CATEGORIES = [
  { id: "home", name: "Hogar", icon: "🏠", color: "#8b5cf6" },
  { id: "services", name: "Servicios", icon: "⚡", color: "#06b6d4" },
  { id: "entertainment", name: "Entretenimiento", icon: "🎮", color: "#ec4899" },
  { id: "education", name: "Educación", icon: "📚", color: "#10b981" },
  { id: "health", name: "Salud", icon: "🏥", color: "#ef4444" },
  { id: "transport", name: "Transporte", icon: "🚗", color: "#f59e0b" },
  { id: "food", name: "Alimentación", icon: "🍽️", color: "#f97316" },
  { id: "shopping", name: "Compras", icon: "🛍️", color: "#6366f1" },
  { id: "other", name: "Otros", icon: "📦", color: "#64748b" },
];

interface DashboardExpense {
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
}

interface DashboardProps {
  expenses: DashboardExpense[];
  month?: number;
  year?: number;
  onAddExpense?: () => void;
  onExpenseClick?: (id: string) => void;
  onMarkAsPaid?: (id: string) => void;
}

export function PremiumDashboard({
  expenses,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  onAddExpense,
  onExpenseClick,
  onMarkAsPaid,
}: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar gastos
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    if (selectedCategory) {
      filtered = filtered.filter(e => e.category?.id === selectedCategory);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(e => e.status === selectedStatus);
    }
    
    // Ordenar: atrasados primero, luego próximos, luego pendientes, pagados al final
    return filtered.sort((a, b) => {
      const statusOrder = { overdue: 0, upcoming: 1, pending: 2, paid: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [expenses, selectedCategory, selectedStatus]);

  // Calcular resumen mensual
  const summary = useMemo(() => {
    return calculateMonthlySummary(
      expenses.map(e => ({ ...e, dueDate: new Date(e.dueDate) })),
      month,
      year
    );
  }, [expenses, month, year]);

  // Conteos por estado
  const counts = useMemo(() => {
    return {
      paid: expenses.filter(e => e.status === "paid").length,
      pending: expenses.filter(e => e.status === "pending").length,
      upcoming: expenses.filter(e => e.status === "upcoming").length,
      overdue: expenses.filter(e => e.status === "overdue").length,
    };
  }, [expenses]);

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Mis Gastos</h1>
              <p className="text-sm text-muted-foreground">
                {new Date(year, month - 1).toLocaleDateString("es-CL", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onAddExpense}
              className="btn-gradient px-4 py-2.5 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nuevo</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          {/* Total Proyectado */}
          <motion.div
            variants={itemVariants}
            className="card-premium p-4 col-span-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mensual</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(summary.totalProjected)}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="progress-bar-bg">
                <motion.div
                  className="progress-bar-fill bg-gradient-to-r from-emerald-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-muted-foreground">
                  {summary.completionRate}% pagado
                </span>
                <span className="text-emerald-400 font-medium">
                  {formatCurrency(summary.totalPaid)} pagado
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="card-premium p-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pagados</p>
                <p className="text-lg font-bold amount-paid">{counts.paid}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="card-premium p-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="text-lg font-bold amount-pending">
                  {counts.pending + counts.upcoming}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={cn(
              "card-premium p-3",
              counts.overdue > 0 && "glow-overdue"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Atrasados</p>
                <p className={cn(
                  "text-lg font-bold",
                  counts.overdue > 0 ? "amount-overdue" : "amount-pending"
                )}>
                  {counts.overdue}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="card-premium p-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Días restantes</p>
                <p className="text-lg font-bold text-foreground">
                  {summary.remainingDays}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Filtros</h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-primary flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar" : "Mostrar"}
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    Todas
                  </motion.button>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1.5",
                        selectedCategory === cat.id
                          ? "text-white"
                          : "bg-secondary text-secondary-foreground"
                      )}
                      style={
                        selectedCategory === cat.id
                          ? { backgroundColor: cat.color }
                          : undefined
                      }
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </motion.button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  {[
                    { id: "paid", label: "Pagado", color: "#86efac" },
                    { id: "pending", label: "Pendiente", color: "#94a3b8" },
                    { id: "upcoming", label: "Próximo", color: "#fcd34d" },
                    { id: "overdue", label: "Atrasado", color: "#fca5a5" },
                  ].map((status) => (
                    <motion.button
                      key={status.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setSelectedStatus(
                          selectedStatus === status.id ? null : (status.id as ExpenseStatus)
                        )
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        selectedStatus === status.id
                          ? "ring-2 ring-offset-2 ring-offset-background"
                          : "opacity-60 hover:opacity-100"
                      )}
                      style={
                        selectedStatus === status.id
                          ? {
                              backgroundColor: `${status.color}20`,
                              color: status.color,
                              boxShadow: `0 0 0 2px ${status.color}`,
                            }
                          : {
                              backgroundColor: `${status.color}15`,
                              color: status.color,
                            }
                      }
                    >
                      {status.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">
            Cuentas ({filteredExpenses.length})
          </h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ExpenseCard
                      {...expense}
                      onClick={onExpenseClick}
                      onMarkAsPaid={onMarkAsPaid}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 card-premium"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    No hay gastos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory || selectedStatus
                      ? "Intenta con otros filtros"
                      : "Comienza agregando tu primer gasto"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Quick Stats Widget (para mostrar en otras páginas)
export function QuickStatsWidget({
  expenses,
}: {
  expenses: DashboardExpense[];
}) {
  const stats = useMemo(() => {
    const overdue = expenses.filter((e) => e.status === "overdue");
    const upcoming = expenses.filter((e) => e.status === "upcoming");
    const pending = expenses.filter((e) => e.status === "pending");
    const totalPending = [...overdue, ...upcoming, ...pending].reduce(
      (sum, e) => sum + e.amount,
      0
    );

    return {
      overdueCount: overdue.length,
      upcomingCount: upcoming.length,
      totalPending,
      urgent: overdue.length > 0 || upcoming.length > 0,
    };
  }, [expenses]);

  if (!stats.urgent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mx-4 mb-4 p-4 rounded-2xl border",
        stats.overdueCount > 0
          ? "bg-red-500/10 border-red-500/30 glow-overdue"
          : "bg-amber-500/10 border-amber-500/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            stats.overdueCount > 0 ? "bg-red-500/20" : "bg-amber-500/20"
          )}
        >
          <AlertCircle
            className={cn(
              "w-5 h-5",
              stats.overdueCount > 0 ? "text-red-400" : "text-amber-400"
            )}
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">
            {stats.overdueCount > 0
              ? `${stats.overdueCount} cuentas atrasadas`
              : `${stats.upcomingCount} cuentas por vencer`}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            Total pendiente: {" "}
            <span
              className={cn(
                "font-medium",
                stats.overdueCount > 0 ? "amount-overdue" : "amount-upcoming"
              )}
            >
              {new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
              }).format(stats.totalPending)}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
