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

export interface Branch {
  id: string
  ownerId: string
  name: string
  type: 'home' | 'office' | 'vacation' | 'business'
  description?: string
  color: string
  currency: string
  isActive: boolean
  settings: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface BranchMember {
  id: string
  branchId: string
  userId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  canCreateExpenses: boolean
  canApprove: boolean
  defaultSplitPercent?: number
  joinedAt: Date
}

export interface Category {
  id: string
  branchId: string
  name: string
  icon: string
  color: string
  parentId?: string
  isSystem: boolean
  budgetLimit?: number
  createdAt: Date
}

export type ExpenseStatus = 'pending' | 'funds_assigned' | 'paid' | 'cancelled'
export type SplitType = 'equal' | 'percentage' | 'amount'
export type PaymentMethod = 'cash' | 'transfer' | 'credit' | 'debit'

export interface Expense {
  id: string
  branchId: string
  createdBy: string
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
  isSplit: boolean
  splitType?: SplitType
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

export type ExpenseSplitStatus = 'pending' | 'assigned' | 'paid'

export interface ExpenseSplit {
  id: string
  expenseId: string
  userId: string
  amount: number
  percentage?: number
  status: ExpenseSplitStatus
  assignedAt?: Date
  paidAt?: Date
}

export interface Document {
  id: string
  expenseId?: string
  branchId: string
  uploadedBy: string
  fileName: string
  fileType: string
  fileSize: bigint
  storageKey: string
  thumbnailUrl?: string
  previewUrl?: string
  extractedText?: string
  metadata: Record<string, unknown>
  isVerified: boolean
  createdAt: Date
}

export interface Activity {
  id: string
  branchId?: string
  userId?: string
  type: string
  entityType?: 'expense' | 'document' | 'payment'
  entityId?: string
  title: string
  description?: string
  metadata: Record<string, unknown>
  createdAt: Date
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
