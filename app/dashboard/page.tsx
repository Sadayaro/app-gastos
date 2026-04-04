import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react"
import { ExpenseCard } from "@/components/expenses/expense-card"
import { StatusBadge } from "@/components/status-badge"

// Mock data - replace with actual data fetching
const stats = {
  totalMonthly: 1245000,
  pendingAmount: 320000,
  paidThisMonth: 925000,
  pendingCount: 4,
  budgetUsedPercent: 85,
  totalChange: 12,
  pendingChange: -5,
}

const recentExpenses = [
  {
    id: "1",
    branchId: "1",
    createdBy: "1",
    title: "Arriendo Departamento",
    amount: 450000,
    currency: "CLP",
    status: "pending",
    expenseDate: new Date("2026-01-15"),
    dueDate: new Date("2026-01-20"),
    isSplit: false,
    tags: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Vivienda", color: "#6366f1" },
  },
  {
    id: "2",
    branchId: "1",
    createdBy: "1",
    title: "Supermercado Lider",
    amount: 85000,
    currency: "CLP",
    status: "paid",
    expenseDate: new Date("2026-01-14"),
    paidAt: new Date("2026-01-14"),
    isSplit: true,
    tags: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Alimentación", color: "#10b981" },
  },
  {
    id: "3",
    branchId: "1",
    createdBy: "1",
    title: "Internet Hogar",
    amount: 35000,
    currency: "CLP",
    status: "funds_assigned",
    expenseDate: new Date("2026-01-13"),
    dueDate: new Date("2026-01-25"),
    isSplit: false,
    tags: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Servicios", color: "#f59e0b" },
  },
]

const activities = [
  { id: "1", title: "Juan agregó Supermercado", amount: 85000, time: "hace 2h", type: "expense" },
  { id: "2", title: "Pago confirmado: Luz", amount: 45000, time: "hace 5h", type: "payment" },
  { id: "3", title: "Boleta cargada: Internet", amount: null, time: "hace 1d", type: "document" },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Resumen financiero de Casa Principal
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
                <ArrowUpRight className="h-3 w-3 text-status-paid" />
                <span className="text-xs text-status-paid">+{stats.totalChange}%</span>
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
                2
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
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      {activity.type === "expense" && <TrendingDown className="h-4 w-4 text-status-pending" />}
                      {activity.type === "payment" && <CheckCircle2 className="h-4 w-4 text-status-paid" />}
                      {activity.type === "document" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                        {activity.amount && (
                          <span className="font-mono ml-1">{formatCurrency(activity.amount)}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
            {recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense as any} />
            ))}
          </div>
        </div>

        {/* Pending Expenses Priority */}
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
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-status-pending" />
                    <div>
                      <p className="font-medium text-foreground">Arriendo Dpto</p>
                      <p className="text-sm text-muted-foreground">Vence: Mañana</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-semibold">{formatCurrency(450000)}</span>
                    <button className="px-4 py-2 bg-status-paid/20 text-status-paid rounded-lg text-sm font-medium hover:bg-status-paid/30 transition-colors">
                      Pagar
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-status-assigned" />
                    <div>
                      <p className="font-medium text-foreground">Internet Hogar</p>
                      <p className="text-sm text-muted-foreground">Vence: 3 días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-semibold">{formatCurrency(35000)}</span>
                    <button className="px-4 py-2 bg-status-assigned/20 text-status-assigned rounded-lg text-sm font-medium hover:bg-status-assigned/30 transition-colors">
                      Asignar
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
