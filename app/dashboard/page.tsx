import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDateRelative } from "@/lib/utils"
import { prisma } from "@/lib/db/prisma"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react"
import { ExpenseCard } from "@/components/expenses/expense-card"

// Types based on Prisma schema
interface Expense {
  id: string
  branchId: string
  createdBy: string
  categoryId: string | null
  title: string
  description: string | null
  amount: number
  currency: string
  status: 'pending' | 'funds_assigned' | 'paid' | 'cancelled'
  expenseDate: Date
  dueDate: Date | null
  paidAt: Date | null
  paymentMethod: string | null
  paidBy: string | null
  isSplit: boolean
  splitType: string | null
  tags: string[]
  location: Record<string, any> | null
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
  category?: { name: string; color: string } | null
  branch?: { name: string } | null
}

interface Activity {
  id: string
  branchId: string | null
  userId: string | null
  type: string
  entityType: string | null
  entityId: string | null
  title: string
  description: string | null
  metadata: Record<string, any>
  createdAt: Date
  user?: { firstName: string; lastName: string } | null
}

interface ExpenseWithRelations extends Expense {
  category: { name: string; color: string } | null
  branch: { name: string } | null
}

interface ActivityWithUser extends Activity {
  user: { firstName: string; lastName: string } | null
}

async function getDashboardStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalThisMonth,
    totalLastMonth,
    pendingAmount,
    paidThisMonth,
    pendingCount,
    recentExpenses,
    pendingExpenses,
    activities,
  ] = await Promise.all([
    prisma.expense.aggregate({
      where: {
        expenseDate: { gte: startOfMonth },
        status: { not: 'cancelled' },
      },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        expenseDate: { gte: startOfLastMonth, lte: endOfLastMonth },
        status: { not: 'cancelled' },
      },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { status: 'pending' },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        status: 'paid',
        paidAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.expense.count({
      where: { status: 'pending' },
    }),
    prisma.expense.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        branch: true,
      },
    }) as unknown as Promise<ExpenseWithRelations[]>,
    prisma.expense.findMany({
      where: {
        status: 'pending',
        dueDate: { not: null, gte: now },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
    prisma.activity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    }) as unknown as Promise<ActivityWithUser[]>,
  ])

  const currentTotal = Number(totalThisMonth._sum.amount || 0)
  const lastTotal = Number(totalLastMonth._sum.amount || 0)
  const changePercent = lastTotal > 0 
    ? Math.round(((currentTotal - lastTotal) / lastTotal) * 100) 
    : 0

  return {
    stats: {
      totalMonthly: currentTotal,
      pendingAmount: Number(pendingAmount._sum.amount || 0),
      paidThisMonth: Number(paidThisMonth._sum.amount || 0),
      pendingCount,
      budgetUsedPercent: currentTotal > 0 ? 85 : 0,
      totalChange: changePercent,
    },
    recentExpenses,
    pendingExpenses,
    activities: activities.map((a: ActivityWithUser) => ({
      id: a.id,
      title: a.title,
      time: formatDateRelative(a.createdAt),
      type: a.type,
    })),
  }
}

export default async function DashboardPage() {
  const { stats, recentExpenses, pendingExpenses, activities } = await getDashboardStats()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Resumen financiero de todas tus sucursales
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Período:</span>
            <select className="bg-secondary border-none rounded-lg px-3 py-2 text-sm">
              <option>Enero 2026</option>
              <option>Diciembre 2025</option>
              <option>Noviembre 2025</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-premium border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Mensual
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground font-mono">
                {formatCurrency(stats.totalMonthly)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className={`h-3 w-3 ${stats.totalChange >= 0 ? 'text-status-paid' : 'text-status-pending'}`} />
                <span className={`text-xs ${stats.totalChange >= 0 ? 'text-status-paid' : 'text-status-pending'}`}>
                  {stats.totalChange >= 0 ? '+' : ''}{stats.totalChange}%
                </span>
                <span className="text-xs text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes de Pago
              </CardTitle>
              <Clock className="h-4 w-4 text-status-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground font-mono">
                {formatCurrency(stats.pendingAmount)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">{stats.pendingCount} gastos por pagar</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pagado Este Mes
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-status-paid" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground font-mono">
                {formatCurrency(stats.paidThisMonth)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">{stats.budgetUsedPercent}% del presupuesto</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Próximos Vencimientos
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-status-alert" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {pendingExpenses.length}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">Esta semana</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Activity Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart Placeholder */}
          <Card className="card-premium border-none lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg">Flujo Financiero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-secondary/50 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico de flujo financiero</p>
                  <p className="text-sm">Evolución últimos 6 meses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="card-premium border-none lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay actividad reciente
                  </p>
                ) : (
                  activities.map((activity: { id: string; title: string; time: string; type: string }) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        {activity.type === "expense_created" && <TrendingDown className="h-4 w-4 text-status-pending" />}
                        {activity.type === "payment_made" && <CheckCircle2 className="h-4 w-4 text-status-paid" />}
                        {activity.type === "split_assigned" && <AlertCircle className="h-4 w-4 text-status-assigned" />}
                        {!['expense_created', 'payment_made', 'split_assigned'].includes(activity.type) && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Gastos Recientes</h2>
            <a href="/expenses" className="text-sm text-primary hover:underline">
              Ver todos
            </a>
          </div>
          <div className="grid gap-3">
            {recentExpenses.length === 0 ? (
              <Card className="card-premium border-none">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No hay gastos registrados</p>
                </CardContent>
              </Card>
            ) : (
              recentExpenses.map((expense: ExpenseWithRelations) => (
                <ExpenseCard key={expense.id} expense={expense as any} />
              ))
            )}
          </div>
        </div>

        {/* Pending Expenses */}
        {pendingExpenses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-status-pending" />
                Pendientes de Pago
              </h2>
            </div>
            <Card className="card-premium border-none">
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {pendingExpenses.map((expense: Expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-status-pending" />
                        <div>
                          <p className="font-medium text-foreground">{expense.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Vence: {expense.dueDate ? formatDateRelative(expense.dueDate) : 'Sin fecha'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-semibold">{formatCurrency(Number(expense.amount))}</span>
                        <button className="px-4 py-2 bg-status-paid/20 text-status-paid rounded-lg text-sm font-medium hover:bg-status-paid/30 transition-colors">
                          Pagar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
