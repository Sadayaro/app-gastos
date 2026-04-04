import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/db/prisma"
import { formatCurrency } from "@/lib/utils"
import { 
  Building2, 
  Home, 
  Briefcase, 
  Palmtree, 
  Plus, 
  Users,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import CreateBranchDialog from "./create-branch-dialog"

export const dynamic = 'force-dynamic'

const branchTypes = [
  { value: "home", label: "Hogar", icon: Home },
  { value: "office", label: "Oficina", icon: Briefcase },
  { value: "vacation", label: "Vacaciones", icon: Palmtree },
  { value: "business", label: "Negocio", icon: Building2 },
]

interface BranchWithStats {
  id: string
  name: string
  type: string
  description: string | null
  color: string
  currency: string
  isActive: boolean
  monthlyTotal: number
  expenseCount: number
  memberCount: number
}

async function getBranches(): Promise<BranchWithStats[]> {
  // Return empty array if prisma is not initialized (build time)
  if (!process.env.DATABASE_URL) {
    return []
  }
  
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          expenses: true,
          members: true,
        },
      },
      expenses: {
        where: {
          expenseDate: { gte: startOfMonth },
          status: { not: 'cancelled' },
        },
        select: { amount: true },
      },
    },
  })

  return branches.map((branch: typeof branches[0]) => ({
    id: branch.id,
    name: branch.name,
    type: branch.type,
    description: branch.description,
    color: branch.color,
    currency: branch.currency,
    isActive: branch.isActive,
    monthlyTotal: branch.expenses.reduce((sum: number, e: typeof branch.expenses[0]) => sum + Number(e.amount), 0),
    expenseCount: branch._count.expenses,
    memberCount: branch._count.members,
  }))
}

async function createBranch(formData: FormData) {
  "use server"
  
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const description = formData.get("description") as string
  const color = formData.get("color") as string
  
  await prisma.branch.create({
    data: {
      name,
      type,
      description,
      color,
      ownerId: "temp-user-id", // TODO: Get from auth
      currency: "CLP",
    },
  })
  
  revalidatePath("/branches")
}

function BranchIcon({ type, className, style }: { type: string; className?: string; style?: React.CSSProperties }) {
  const typeConfig = branchTypes.find(t => t.value === type)
  const Icon = typeConfig?.icon || Building2
  return <Icon className={className} style={style} />
}

export default async function BranchesPage() {
  const branches = await getBranches()
  
  const totalMonthly = branches.reduce((sum, b) => sum + b.monthlyTotal, 0)
  const totalExpenses = branches.reduce((sum, b) => sum + b.expenseCount, 0)
  const totalMembers = branches.reduce((sum, b) => sum + b.memberCount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Sucursales</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Gestiona tus espacios y sus flujos de gastos
            </p>
          </div>
          <CreateBranchDialog />
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
                          {formatCurrency(branch.monthlyTotal)}
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
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
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
                    {formatCurrency(totalMonthly)}
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
                    {totalMembers}
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
                    {totalExpenses}
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
