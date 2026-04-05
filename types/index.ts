export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
  timezone: string
  currencyPref: string
  isAdmin: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'expense' | 'income'
  isSystem: boolean
  budgetLimit?: number
  createdAt: Date
}

export type ExpenseStatus = 'pending' | 'upcoming' | 'paid' | 'overdue'
export type PaymentMethod = 'cash' | 'transfer' | 'credit' | 'debit' | 'check'

export interface Expense {
  id: string
  userId: string
  categoryId?: string
  title: string
  description?: string
  amount: number
  currency: string
  status: ExpenseStatus
  expenseDate: Date
  dueDate?: Date
  paidAt?: Date
  paymentMethod?: PaymentMethod
  paidBy?: string
  isRecurring: boolean
  recurrenceType?: string
  hasDocument: boolean
  alarmOffset: number
  alarmTriggered: boolean
  tags: string[]
  location?: {
    lat: number
    lng: number
    address?: string
    placeName?: string
  }
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  expenseId?: string
  userId: string
  fileName: string
  fileType: string
  fileSize: bigint
  storageKey: string
  storageUrl?: string
  thumbnailUrl?: string
  extractedText?: string
  extractedAmount?: number
  extractedDate?: Date
  metadata: Record<string, unknown>
  isVerified: boolean
  createdAt: Date
}

export interface Activity {
  id: string
  userId?: string
  type: string
  entityType?: 'expense' | 'document' | 'alarm'
  entityId?: string
  title: string
  description?: string
  metadata: Record<string, unknown>
  createdAt: Date
}

export interface Alarm {
  id: string
  expenseId: string
  userId: string
  type: 'seven_days' | 'forty_eight_hours' | 'same_day' | 'overdue'
  status: 'pending' | 'sent' | 'dismissed' | 'snoozed'
  triggerAt: Date
  sentAt?: Date
  dismissedAt?: Date
  pushSent: boolean
  createdAt: Date
}

export interface Income {
  id: string
  userId: string
  categoryId?: string
  title: string
  description?: string
  amount: number
  currency: string
  source: string
  incomeDate: Date
  isRecurring: boolean
  recurrenceType?: string
  createdAt: Date
  updatedAt: Date
}

// Dashboard Types
export interface DashboardStats {
  totalMonthly: number
  pendingAmount: number
  paidThisMonth: number
  pendingCount: number
  budgetUsedPercent: number
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  categoryColor: string
  amount: number
  percentage: number
}

export interface MonthlyFlow {
  month: string
  income: number
  expenses: number
  projection: number
}
