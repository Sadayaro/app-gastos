import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExpenseCard } from "@/components/expenses/expense-card"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import { formatCurrency } from "@/lib/utils"
import CreateExpenseDialog from "./create-expense-dialog"

export const dynamic = 'force-dynamic'

interface ExpenseWithCategory {
  id: string
  title: string
  amount: number
  currency: string
  status: 'pending' | 'upcoming' | 'paid' | 'overdue'
  expenseDate: Date
  dueDate: Date | null
  category: { name: string; color: string } | null
}

async function getExpenses(): Promise<ExpenseWithCategory[]> {
  // Return empty array if prisma is not initialized (build time)
  if (!process.env.DATABASE_URL) {
    return []
  }
  
  const expenses = await prisma.expense.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true, color: true } },
    },
  })
  
  return expenses.map((e: any) => ({
    ...e,
    amount: Number(e.amount),
  })) as unknown as ExpenseWithCategory[]
}

export default async function ExpensesPage({ searchParams }: { searchParams: { status?: string; search?: string } }) {
  const statusFilter = searchParams.status || "all"
  const searchQuery = searchParams.search || ""
  
  const allExpenses = await getExpenses()
  
  const filteredExpenses = allExpenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = allExpenses.reduce((acc, e) => acc + e.amount, 0)
  const pendingAmount = allExpenses.filter(e => e.status === "pending").reduce((acc, e) => acc + e.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gastos</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Gestiona todos tus gastos en un solo lugar
            </p>
          </div>
          <CreateExpenseDialog />
        </div>

        {/* Filters */}
        <Card className="card-premium border-none">
          <CardContent className="p-4">
            <form className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Buscar gastos..."
                  defaultValue={searchQuery}
                  className="pl-10 bg-secondary border-none"
                />
              </div>
              <Select name="status" defaultValue={statusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-none">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="paid">Pagados</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="hidden">Filtrar</Button>
            </form>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <div className="grid gap-4">
          {filteredExpenses.length === 0 ? (
            <Card className="card-premium border-none">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron gastos
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredExpenses.map((expense: ExpenseWithCategory) => (
              <Link key={expense.id} href={`/expenses/${expense.id}`}>
                <ExpenseCard expense={expense as any} />
              </Link>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-premium border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">
                {formatCurrency(totalAmount)}
              </p>
            </CardContent>
          </Card>
          <Card className="card-premium border-none">
            <CardContent>
              <p className="text-2xl font-bold font-mono text-status-pending">
                {formatCurrency(pendingAmount)}
              </p>
            </CardContent>
          </Card>
          <Card className="card-premium border-none">
            <CardContent>
              <p className="text-2xl font-bold">{allExpenses.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
