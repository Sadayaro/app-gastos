"use client"

import { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { NotificationBell } from "@/components/notification-bell"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 transition-all duration-300">
        {/* Header with notifications */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-background/80 backdrop-blur-md border-b border-border lg:border-none px-4 py-3 flex items-center justify-end gap-4">
          <NotificationBell />
        </div>
        <div className="p-4 lg:p-8 pt-20 lg:pt-20">
          {children}
        </div>
      </main>
    </div>
  )
}
