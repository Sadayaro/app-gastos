"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExpenseCard } from "@/components/expenses/expense-card"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

const expenses = [
  {
    id: "1",
    branchId: "1",
    createdBy: "1",
    title: "Arriendo Departamento",
    amount: 450000,
    currency: "CLP",
    status: "pending" as const,
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
    status: "paid" as const,
    expenseDate: new Date("2026-01-14"),
    dueDate: undefined,
    isSplit: false,
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
    title: "Cuenta de Luz",
    amount: 45000,
    currency: "CLP",
    status: "pending" as const,
    expenseDate: new Date("2026-01-10"),
    dueDate: new Date("2026-01-25"),
    isSplit: true,
    tags: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Servicios", color: "#f59e0b" },
  },
]

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || expense.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gastos</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona todos tus gastos en un solo lugar
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger
              render={<Button className="btn-gradient">Nuevo Gasto</Button>}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Gasto
            </DialogTrigger>
            <DialogContent className="card-premium border-none">
              <DialogHeader>
                <DialogTitle className="text-xl">Crear Nuevo Gasto</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Registra un nuevo gasto para tu sucursal
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    placeholder="Ej: Arriendo enero"
                    className="bg-secondary border-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monto</label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-secondary border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-none">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="housing">Vivienda</SelectItem>
                        <SelectItem value="food">Alimentación</SelectItem>
                        <SelectItem value="transport">Transporte</SelectItem>
                        <SelectItem value="services">Servicios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="btn-gradient">Crear Gasto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="card-premium border-none">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar gastos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-none"
                />
              </div>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                <SelectTrigger className="w-[180px] bg-secondary border-none">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="paid">Pagados</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            filteredExpenses.map((expense) => (
              <Link key={expense.id} href={`/expenses/${expense.id}`}>
                <ExpenseCard expense={expense} />
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
                ${(expenses.reduce((acc, e) => acc + e.amount, 0) / 1000).toFixed(0)}k
              </p>
            </CardContent>
          </Card>
          <Card className="card-premium border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono text-status-pending">
                ${(expenses.filter(e => e.status === "pending").reduce((acc, e) => acc + e.amount, 0) / 1000).toFixed(0)}k
              </p>
            </CardContent>
          </Card>
          <Card className="card-premium border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Cantidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
