"use client"

import { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 transition-all duration-300">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
