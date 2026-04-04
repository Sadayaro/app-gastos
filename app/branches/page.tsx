"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Building2, 
  Home, 
  Briefcase, 
  Palmtree, 
  Plus, 
  MoreVertical,
  Users,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const branchTypes = [
  { value: "home", label: "Hogar", icon: Home },
  { value: "office", label: "Oficina", icon: Briefcase },
  { value: "vacation", label: "Vacaciones", icon: Palmtree },
  { value: "business", label: "Negocio", icon: Building2 },
]

const branches = [
  {
    id: "1",
    name: "Casa Principal",
    type: "home",
    description: "Hogar familiar - Santiago",
    color: "#6366f1",
    monthlyTotal: 1250000,
    expenseCount: 24,
    memberCount: 3,
    isActive: true,
  },
  {
    id: "2",
    name: "Oficina Centro",
    type: "office",
    description: "Oficina principal empresa",
    color: "#8b5cf6",
    monthlyTotal: 3500000,
    expenseCount: 45,
    memberCount: 8,
    isActive: true,
  },
  {
    id: "3",
    name: "Depto Playa",
    type: "vacation",
    description: "Departamento veraneo Viña",
    color: "#ec4899",
    monthlyTotal: 450000,
    expenseCount: 8,
    memberCount: 2,
    isActive: true,
  },
]

function BranchIcon({ type, className, style }: { type: string; className?: string; style?: React.CSSProperties }) {
  const typeConfig = branchTypes.find(t => t.value === type)
  const Icon = typeConfig?.icon || Building2
  return <Icon className={className} style={style} />
}

export default function BranchesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sucursales</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus espacios y sus flujos de gastos
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger render={<Button className="btn-gradient" />}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sucursal
            </DialogTrigger>
            <DialogContent className="card-premium border-none">
              <DialogHeader>
                <DialogTitle className="text-xl">Crear Nueva Sucursal</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Configura un nuevo espacio para gestionar sus gastos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    placeholder="Ej: Casa de Playa"
                    className="bg-secondary border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-none">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Input 
                    id="description" 
                    placeholder="Breve descripción del espacio"
                    className="bg-secondary border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color identificador</Label>
                  <div className="flex gap-2">
                    {["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="btn-gradient">
                  Crear Sucursal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Branches Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <Link key={branch.id} href={`/dashboard?branch=${branch.id}`}>
              <Card className="card-premium card-premium-hover cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${branch.color}20` }}
                      >
                        <BranchIcon 
                          type={branch.type} 
                          className="h-5 w-5"
                          style={{ color: branch.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{branch.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {branchTypes.find(t => t.value === branch.type)?.label}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {branch.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Este mes</p>
                        <p className="font-mono font-semibold text-sm">
                          ${(branch.monthlyTotal / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Miembros</p>
                        <p className="font-semibold text-sm">{branch.memberCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">
                      {branch.expenseCount} gastos registrados
                    </span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: branch.color }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Summary Stats */}
        <Card className="card-premium border-none">
          <CardHeader>
            <CardTitle className="text-lg">Resumen Consolidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sucursales</p>
                  <p className="text-2xl font-bold">{branches.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-status-paid/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-status-paid" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gasto Total Mensual</p>
                  <p className="text-2xl font-bold font-mono">
                    ${(branches.reduce((acc, b) => acc + b.monthlyTotal, 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-status-pending/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-status-pending" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Miembros</p>
                  <p className="text-2xl font-bold">
                    {branches.reduce((acc, b) => acc + b.memberCount, 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-status-assigned/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-status-assigned" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gastos Activos</p>
                  <p className="text-2xl font-bold">
                    {branches.reduce((acc, b) => acc + b.expenseCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
