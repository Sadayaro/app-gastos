import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"

// GET - Obtener alarmas pendientes del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    const alarms = await prisma.alarm.findMany({
      where: {
        userId: session.user.id,
        status: status as any,
        triggerAt: {
          lte: new Date(), // Solo alarmas que ya deberían dispararse
        },
      },
      include: {
        expense: {
          select: {
            id: true,
            title: true,
            amount: true,
            currency: true,
            dueDate: true,
            status: true,
          },
        },
      },
      orderBy: {
        triggerAt: "asc",
      },
    })

    return NextResponse.json(alarms)
  } catch (error) {
    console.error("Error fetching alarms:", error)
    return NextResponse.json(
      { error: "Failed to fetch alarms" },
      { status: 500 }
    )
  }
}

// POST - Marcar alarma como enviada/dismissed
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { alarmId, action } = body // action: 'dismiss' | 'snooze'

    if (!alarmId || !action) {
      return NextResponse.json(
        { error: "alarmId and action are required" },
        { status: 400 }
      )
    }

    // Verify the alarm belongs to the user
    const alarm = await prisma.alarm.findFirst({
      where: {
        id: alarmId,
        userId: session.user.id,
      },
    })

    if (!alarm) {
      return NextResponse.json({ error: "Alarm not found" }, { status: 404 })
    }

    let updateData: any = {}
    
    if (action === "dismiss") {
      updateData = {
        status: "dismissed",
        dismissedAt: new Date(),
      }
    } else if (action === "snooze") {
      // Snooze for 24 hours
      const newTriggerAt = new Date()
      newTriggerAt.setHours(newTriggerAt.getHours() + 24)
      
      updateData = {
        status: "snoozed",
        triggerAt: newTriggerAt,
      }
    }

    const updatedAlarm = await prisma.alarm.update({
      where: { id: alarmId },
      data: updateData,
    })

    return NextResponse.json(updatedAlarm)
  } catch (error) {
    console.error("Error updating alarm:", error)
    return NextResponse.json(
      { error: "Failed to update alarm" },
      { status: 500 }
    )
  }
}
