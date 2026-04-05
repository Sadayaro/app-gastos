"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { 
  ArrowLeft, 
  Receipt, 
  Calendar, 
  Check,
  Upload,
  FileText,
  Image as ImageIcon,
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
  dueDate: new Date("2026-01-20"),
  category: { name: "Alimentación", color: "#10b981" },
  createdBy: "Juan Pérez",
  documents: [
    { id: "d1", fileName: "Boleta.pdf", fileType: "application/pdf", fileSize: 245000 },
    { id: "d2", fileName: "Foto_mesa.jpg", fileType: "image/jpeg", fileSize: 1200000 },
  ],
}

const activities = [
  { id: "1", title: "Gasto creado por Juan", date: "15 Ene, 13:45", type: "created" },
  { id: "2", title: "Boleta agregada", date: "15 Ene, 13:47", type: "document" },
  { id: "3", title: "Recordatorio configurado", date: "15 Ene, 13:50", type: "alarm" },
]

export default function ExpenseDetailPage() {
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
                        {expense.dueDate && (
                          <>
                            <span className="text-border">|</span>
                            <span>Vence: {formatDate(expense.dueDate)}</span>
                          </>
                        )}
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
