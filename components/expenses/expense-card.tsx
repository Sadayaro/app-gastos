"use client"

import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"
import { Expense } from "@/types"
import { ChevronRight, Users } from "lucide-react"
import Link from "next/link"
import SplitExpenseDialog from "./split-expense-dialog"

interface ExpenseCardProps {
  expense: Expense & { category?: { name: string; color: string } }
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const isOverdue = expense.dueDate && new Date(expense.dueDate) < new Date() && expense.status !== "paid"
  
  return (
    <Link href={`/expenses/${expense.id}`}>
      <div className="group card-premium card-premium-hover p-4 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {expense.category && (
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: expense.category.color }}
                />
              )}
              <span className="text-sm text-muted-foreground">
                {expense.category?.name || "Sin categoría"}
              </span>
              {expense.isSplit && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  <Users className="w-3 h-3" />
                  Dividido
                </span>
              )}
            </div>
            
            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {expense.title}
            </h3>
            
            {expense.description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {expense.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{formatDate(expense.expenseDate)}</span>
              {expense.dueDate && expense.status !== "paid" && (
                <span className={isOverdue ? "text-status-alert" : ""}>
                  Vence: {formatDate(expense.dueDate)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className="font-mono text-lg font-semibold text-foreground">
              {formatCurrency(expense.amount, expense.currency)}
            </span>
            <StatusBadge 
              status={isOverdue ? "alert" : expense.status as any} 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            {!expense.isSplit && expense.status !== "paid" && (
              <div onClick={(e) => e.preventDefault()}>
                <SplitExpenseDialog 
                  expenseId={expense.id} 
                  expenseTitle={expense.title}
                  expenseAmount={Number(expense.amount)}
                />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
            Ver detalle
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
