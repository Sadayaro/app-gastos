"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { 
  ArrowLeft, 
  Receipt, 
  Calendar, 
  Building2,
  Users,
  Check,
  Clock,
  Upload,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Wallet
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const expense = {
  id: "1",
  title: "Almuerzo de Negocios",
  amount: 125000,
  currency: "CLP",
  status: "pending",
  description: "Almuerzo con cliente en restaurante ejecutivo",
  expenseDate: new Date("2026-01-15"),
  category: { name: "Alimentación", color: "#10b981" },
  branch: { name: "Casa Principal" },
  isSplit: true,
  splitType: "equal",
  createdBy: "Juan Pérez",
  documents: [
    { id: "d1", fileName: "Boleta.pdf", fileType: "application/pdf", fileSize: 245000 },
    { id: "d2", fileName: "Foto_mesa.jpg", fileType: "image/jpeg", fileSize: 1200000 },
  ],
}

const splits = [
  { 
    id: "s1", 
    userId: "u1", 
    userName: "Tú (Juan)", 
    amount: 41667, 
    status: "paid",
    paidAt: new Date("2026-01-15"),
    isYou: true 
  },
  { 
    id: "s2", 
    userId: "u2", 
    userName: "María (tu esposa)", 
    amount: 41667, 
    status: "assigned",
    assignedAt: new Date("2026-01-16"),
    isYou: false 
  },
  { 
    id: "s3", 
    userId: "u3", 
    userName: "Carlos (invitado)", 
    amount: 41666, 
    status: "pending",
    isYou: false 
  },
]

const activities = [
  { id: "1", title: "Gasto creado por Juan", date: "15 Ene, 13:45", type: "created" },
  { id: "2", title: "Boleta agregada", date: "15 Ene, 13:47", type: "document" },
  { id: "3", title: "División activada (3 participantes)", date: "15 Ene, 13:50", type: "split" },
  { id: "4", title: "Juan marcó como pagado", date: "15 Ene, 14:00", type: "paid" },
  { id: "5", title: "Dinero asignado para María", date: "16 Ene, 09:30", type: "assigned" },
]

function SplitStatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: "●", label: "Pendiente", color: "text-status-pending bg-status-pending-bg border-status-pending/30" },
    assigned: { icon: "◐", label: "Dinero Asignado", color: "text-status-assigned bg-status-assigned-bg border-status-assigned/30" },
    paid: { icon: "✓", label: "Pagado", color: "text-status-paid bg-status-paid-bg border-status-paid/30" },
  }
  const cfg = config[status as keyof typeof config] || config.pending
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border", cfg.color)}>
      <span className="text-[10px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

export default function ExpenseDetailPage() {
  const params = useParams()
  const [isSplitEnabled, setIsSplitEnabled] = useState(expense.isSplit)
  const [dragActive, setDragActive] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Detalle del Gasto</h1>
            <p className="text-sm text-muted-foreground">
              {expense.category.name} • {formatDate(expense.expenseDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Header Card */}
            <Card className="card-premium border-none">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${expense.category.color}20` }}
                    >
                      <Receipt className="h-7 w-7" style={{ color: expense.category.color }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{expense.title}</h2>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: expense.category.color }}
                        />
                        {expense.category.name}
                        <span className="text-border">|</span>
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(expense.expenseDate)}
                        <span className="text-border">|</span>
                        <Building2 className="h-3.5 w-3.5" />
                        {expense.branch.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono text-foreground">
                      {formatCurrency(expense.amount, expense.currency)}
                    </div>
                    <div className="mt-2">
                      <StatusBadge status={expense.status as any} />
                    </div>
                  </div>
                </div>

                {expense.description && (
                  <p className="mt-4 text-muted-foreground">
                    {expense.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Split Management */}
            <Card className="card-premium border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">División de Gastos</CardTitle>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSplitEnabled}
                      onChange={(e) => setIsSplitEnabled(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">Activar división</span>
                  </label>
                </div>
                <CardDescription>
                  Divide este gasto equitativamente o por porcentajes personalizados
                </CardDescription>
              </CardHeader>
              {isSplitEnabled && (
                <CardContent className="space-y-4">
                  {/* Split Summary */}
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <span className="text-sm text-muted-foreground">Tipo de división:</span>
                    <select className="bg-background border-none rounded px-2 py-1 text-sm">
                      <option value="equal">Equitativo</option>
                      <option value="percentage">Por porcentaje</option>
                      <option value="amount">Por monto</option>
                    </select>
                  </div>

                  {/* Participants */}
                  <div className="space-y-3">
                    {splits.map((split) => (
                      <div 
                        key={split.id} 
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-colors",
                          split.isYou ? "bg-primary/5 border-primary/20" : "bg-secondary/50 border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                            split.isYou ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                          )}>
                            {split.userName.split(" ")[0][0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {split.userName}
                              {split.isYou && <span className="ml-2 text-xs text-primary">(Tú)</span>}
                            </p>
                            {split.paidAt && (
                              <p className="text-xs text-muted-foreground">
                                Pagado el {formatDate(split.paidAt)}
                              </p>
                            )}
                            {split.assignedAt && split.status === "assigned" && (
                              <p className="text-xs text-muted-foreground">
                                Fondos provisionados
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-semibold">
                            {formatCurrency(split.amount)}
                          </span>
                          <SplitStatusBadge status={split.status} />
                          {!split.isYou && split.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <Wallet className="h-3 w-3 mr-1" />
                                Asignar
                              </Button>
                              <Button size="sm" className="h-8 text-xs btn-gradient">
                                <Check className="h-3 w-3 mr-1" />
                                Pagado
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Participant */}
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Agregar participante
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Document Vault */}
            <Card className="card-premium border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Bóveda de Documentos</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Carga y gestiona boletas, facturas y recibos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop Zone */}
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                >
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG (máx. 10MB)
                  </p>
                </div>

                {/* Document List */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {expense.documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center gap-3 p-3 bg-secondary rounded-lg group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        {doc.fileType === "application/pdf" ? (
                          <FileText className="h-5 w-5 text-primary" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Activity History */}
            <Card className="card-premium border-none">
              <CardHeader>
                <CardTitle className="text-lg">Historial de Actividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        {index !== activities.length - 1 && (
                          <div className="absolute top-3 left-[3px] w-[2px] h-full bg-border -mb-4" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-premium border-none">
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full btn-gradient">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Pagado
                </Button>
                <Button variant="outline" className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Asignar Fondos
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Agregar Documento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
