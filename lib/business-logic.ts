/**
 * Sistema de Lógica de Negocio Premium
 * Control de Gastos - Cálculo de estados y alarmas
 */

export type ExpenseStatus = 'paid' | 'pending' | 'overdue' | 'upcoming';

export interface ExpenseWithDates {
  id: string;
  status: ExpenseStatus;
  dueDate: Date;
  paidAt?: Date | null;
  amount: number;
}

export interface AlarmConfig {
  sevenDays: boolean;
  fortyEightHours: boolean;
  sameDay: boolean;
}

export interface DaysRemainingResult {
  days: number;
  status: ExpenseStatus;
  isUrgent: boolean;
  alarmLevel: 'none' | 'info' | 'warning' | 'critical';
  message: string;
}

/**
 * Calcula los días restantes para el vencimiento y determina el estado
 */
export function calculateDaysRemaining(
  expense: ExpenseWithDates,
  now: Date = new Date()
): DaysRemainingResult {
  // Si ya está pagado
  if (expense.status === 'paid' || expense.paidAt) {
    return {
      days: 0,
      status: 'paid',
      isUrgent: false,
      alarmLevel: 'none',
      message: 'Pagado',
    };
  }

  const dueDate = new Date(expense.dueDate);
  dueDate.setHours(23, 59, 59, 999);
  
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determinar estado y nivel de alarma
  let status: ExpenseStatus;
  let alarmLevel: DaysRemainingResult['alarmLevel'];
  let isUrgent: boolean;
  let message: string;

  if (daysRemaining < 0) {
    status = 'overdue';
    alarmLevel = 'critical';
    isUrgent = true;
    message = `Vencido hace ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'día' : 'días'}`;
  } else if (daysRemaining === 0) {
    status = 'upcoming';
    alarmLevel = 'critical';
    isUrgent = true;
    message = 'Vence hoy';
  } else if (daysRemaining === 1) {
    status = 'upcoming';
    alarmLevel = 'warning';
    isUrgent = true;
    message = 'Vence mañana';
  } else if (daysRemaining <= 2) {
    status = 'upcoming';
    alarmLevel = 'warning';
    isUrgent = true;
    message = `Vence en ${daysRemaining} días`;
  } else if (daysRemaining <= 7) {
    status = 'pending';
    alarmLevel = 'info';
    isUrgent = false;
    message = `${daysRemaining} días restantes`;
  } else {
    status = 'pending';
    alarmLevel = 'none';
    isUrgent = false;
    message = `${daysRemaining} días restantes`;
  }

  return {
    days: daysRemaining,
    status,
    isUrgent,
    alarmLevel,
    message,
  };
}

/**
 * Determina qué alarmas deben activarse para un gasto
 */
export function shouldTriggerAlarm(
  expense: ExpenseWithDates,
  alarmConfig: AlarmConfig,
  now: Date = new Date()
): { type: string; shouldTrigger: boolean; triggerAt: Date }[] {
  const dueDate = new Date(expense.dueDate);
  const alarms: { type: string; shouldTrigger: boolean; triggerAt: Date }[] = [];

  // 7 días antes
  if (alarmConfig.sevenDays) {
    const sevenDaysBefore = new Date(dueDate);
    sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
    sevenDaysBefore.setHours(9, 0, 0, 0);
    
    alarms.push({
      type: 'seven_days',
      shouldTrigger: now >= sevenDaysBefore && expense.status !== 'paid',
      triggerAt: sevenDaysBefore,
    });
  }

  // 48 horas antes
  if (alarmConfig.fortyEightHours) {
    const fortyEightHoursBefore = new Date(dueDate);
    fortyEightHoursBefore.setHours(fortyEightHoursBefore.getHours() - 48);
    fortyEightHoursBefore.setHours(9, 0, 0, 0);
    
    alarms.push({
      type: 'forty_eight_hours',
      shouldTrigger: now >= fortyEightHoursBefore && expense.status !== 'paid',
      triggerAt: fortyEightHoursBefore,
    });
  }

  // Mismo día (9 AM)
  if (alarmConfig.sameDay) {
    const sameDay = new Date(dueDate);
    sameDay.setHours(9, 0, 0, 0);
    
    alarms.push({
      type: 'same_day',
      shouldTrigger: now >= sameDay && expense.status !== 'paid',
      triggerAt: sameDay,
    });
  }

  return alarms;
}

/**
 * Calcula totales mensuales proyectados vs pagados
 */
export interface MonthlySummary {
  totalProjected: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  completionRate: number;
  remainingDays: number;
}

export function calculateMonthlySummary(
  expenses: ExpenseWithDates[],
  month: number,
  year: number
): MonthlySummary {
  const now = new Date();
  const lastDayOfMonth = new Date(year, month, 0);
  const remainingDays = Math.ceil((lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let totalProjected = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  for (const expense of expenses) {
    totalProjected += expense.amount;
    
    if (expense.status === 'paid') {
      totalPaid += expense.amount;
    } else if (expense.status === 'overdue') {
      totalOverdue += expense.amount;
    } else {
      totalPending += expense.amount;
    }
  }

  const completionRate = totalProjected > 0 
    ? Math.round((totalPaid / totalProjected) * 100) 
    : 0;

  return {
    totalProjected,
    totalPaid,
    totalPending,
    totalOverdue,
    completionRate,
    remainingDays: Math.max(0, remainingDays),
  };
}

/**
 * Agrupa gastos por categoría con totales
 */
export function groupByCategory<T extends { categoryId?: string | null; categoryName?: string; amount: number }>(
  items: T[]
): { categoryId: string; categoryName: string; total: number; count: number }[] {
  const groups = new Map<string, { categoryId: string; categoryName: string; total: number; count: number }>();

  for (const item of items) {
    const catId = item.categoryId || 'uncategorized';
    const catName = item.categoryName || 'Sin categoría';
    
    if (!groups.has(catId)) {
      groups.set(catId, {
        categoryId: catId,
        categoryName: catName,
        total: 0,
        count: 0,
      });
    }
    
    const group = groups.get(catId)!;
    group.total += item.amount;
    group.count += 1;
  }

  return Array.from(groups.values()).sort((a, b) => b.total - a.total);
}

/**
 * Filtra gastos por múltiples criterios
 */
export interface FilterOptions {
  status?: ExpenseStatus | ExpenseStatus[];
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export function filterExpenses<T extends { 
  status: ExpenseStatus; 
  categoryId?: string | null;
  dueDate: Date;
  amount: number;
  title: string;
}>(
  expenses: T[],
  filters: FilterOptions
): T[] {
  return expenses.filter(expense => {
    // Filtro por estado
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      if (!statuses.includes(expense.status)) {
        return false;
      }
    }

    // Filtro por categoría
    if (filters.categoryId && expense.categoryId !== filters.categoryId) {
      return false;
    }

    // Filtro por fecha de inicio
    if (filters.startDate && new Date(expense.dueDate) < filters.startDate) {
      return false;
    }

    // Filtro por fecha de fin
    if (filters.endDate && new Date(expense.dueDate) > filters.endDate) {
      return false;
    }

    // Filtro por monto mínimo
    if (filters.minAmount !== undefined && expense.amount < filters.minAmount) {
      return false;
    }

    // Filtro por monto máximo
    if (filters.maxAmount !== undefined && expense.amount > filters.maxAmount) {
      return false;
    }

    // Filtro por búsqueda de texto
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!expense.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Genera la próxima fecha de recurrencia
 */
export function getNextRecurrenceDate(
  baseDate: Date,
  recurrenceType: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
): Date {
  const next = new Date(baseDate);
  
  switch (recurrenceType) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  return next;
}
