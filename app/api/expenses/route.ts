import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const {
      title,
      amount,
      currency,
      categoryId,
      description,
      dueDate,
      isRecurring,
      recurrenceType,
      recurrenceEnd,
      alarmOffset,
    } = body

    if (!title || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Título y monto son requeridos" },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        currency: currency || "CLP",
        categoryId,
        description,
        status: "pending",
        expenseDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        isRecurring: isRecurring || false,
        recurrenceType,
        recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
        alarmOffset: alarmOffset ?? 7,
        userId: "temp-user-id", // TODO: Replace with actual auth
      },
    })

    // Crear alarma si corresponde
    if (dueDate && alarmOffset !== null) {
      const alarmDate = new Date(dueDate)
      alarmDate.setDate(alarmDate.getDate() - alarmOffset)
      
      await prisma.alarm.create({
        data: {
          expenseId: expense.id,
          userId: session.user.id,
          triggerAt: alarmDate,
          type: alarmOffset === 0 ? "same_day" : alarmOffset === 1 ? "forty_eight_hours" : "seven_days",
          status: "pending",
        },
      })
    }

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expenses = await prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        alarms: true,
        documents: true,
      },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    )
  }
}
