"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { formatDistanceToNow, formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface Alarm {
  id: string
  type: string
  status: string
  triggerAt: string
  sentAt: string | null
  expense: {
    id: string
    title: string
    amount: number
    currency: string
    dueDate: string
    status: string
  }
}

export function NotificationBell() {
  const { data: session } = useSession()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchAlarms = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch("/api/alarms?status=pending")
      if (response.ok) {
        const data = await response.json()
        setAlarms(data)
        setUnreadCount(data.length)
      }
    } catch (error) {
      console.error("Error fetching alarms:", error)
    }
  }, [session])

  useEffect(() => {
    fetchAlarms()
    const interval = setInterval(fetchAlarms, 60000)
    return () => clearInterval(interval)
  }, [fetchAlarms])

  async function dismissAlarm(alarmId: string) {
    try {
      const response = await fetch("/api/alarms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alarmId, action: "dismiss" }),
      })

      if (response.ok) {
        setAlarms((prev) => prev.filter((a) => a.id !== alarmId))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error dismissing alarm:", error)
    }
  }

  async function snoozeAlarm(alarmId: string) {
    try {
      const response = await fetch("/api/alarms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alarmId, action: "snooze" }),
      })

      if (response.ok) {
        setAlarms((prev) => prev.filter((a) => a.id !== alarmId))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error snoozing alarm:", error)
    }
  }

  function getAlarmIcon(type: string) {
    switch (type) {
      case "seven_days":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "forty_eight_hours":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "same_day":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  function getAlarmMessage(type: string, expenseTitle: string) {
    switch (type) {
      case "seven_days":
        return `${expenseTitle} vence en 7 días`
      case "forty_eight_hours":
        return `${expenseTitle} vence en 48 horas`
      case "same_day":
        return `${expenseTitle} vence hoy`
      case "overdue":
        return `${expenseTitle} está atrasado`
      default:
        return `Recordatorio: ${expenseTitle}`
    }
  }

  function getAlarmBadgeColor(type: string) {
    switch (type) {
      case "seven_days":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "forty_eight_hours":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "same_day":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "overdue":
        return "bg-red-600/10 text-red-600 border-red-600/20"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 card-premium border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {alarms.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No hay notificaciones pendientes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alarms.map((alarm) => (
                    <div key={alarm.id} className={cn("p-3 rounded-lg border", getAlarmBadgeColor(alarm.type))}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getAlarmIcon(alarm.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {getAlarmMessage(alarm.type, alarm.expense.title)}
                          </p>
                          <p className="text-xs opacity-80 mt-1">
                            {formatCurrency(alarm.expense.amount)} • {formatDistanceToNow(new Date(alarm.expense.dueDate))}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => dismissAlarm(alarm.id)}>
                              Descartar
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => snoozeAlarm(alarm.id)}>
                              Posponer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
