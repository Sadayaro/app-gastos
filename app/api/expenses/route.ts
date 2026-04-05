import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: NextRequest) {
  try {
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
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        isRecurring: isRecurring || false,
        recurrenceType,
        recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
        alarmOffset: alarmOffset ?? 7,
        createdBy: "temp-user-id", // TODO: Replace with actual auth
      },
    })

    // Crear alarma si corresponde
    if (dueDate && alarmOffset !== null) {
      const alarmDate = new Date(dueDate)
      alarmDate.setDate(alarmDate.getDate() - alarmOffset)
      
      await prisma.alarm.create({
        data: {
          expenseId: expense.id,
          userId: "temp-user-id", // TODO: Replace with actual auth
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
    const expenses = await prisma.expense.findMany({
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
