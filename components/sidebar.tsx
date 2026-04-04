"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Receipt,
  Building2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Gastos", icon: Receipt },
  { href: "/branches", label: "Sucursales", icon: Building2 },
  { href: "/documents", label: "Documentos", icon: FileText },
  { href: "/settings", label: "Configuración", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">
                FinTrack
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">F</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* New Expense Button */}
        <div className="p-4">
          <Button 
            className={cn(
              "btn-gradient w-full",
              collapsed && "w-8 h-8 p-0"
            )}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Nuevo Gasto</span>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <ThemeToggle collapsed={collapsed} />
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm font-medium">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Cerrar sesión</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
