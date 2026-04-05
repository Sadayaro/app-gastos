import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"

// GET - Obtener un gasto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        category: true,
        documents: true,
        alarms: true,
      },
    })

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error fetching expense:", error)
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un gasto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      status,
    } = body

    // Verify the expense belongs to the user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        title,
        amount,
        currency,
        categoryId,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        isRecurring,
        recurrenceType,
        recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
        alarmOffset,
        status,
      },
    })

    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un gasto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the expense belongs to the user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    await prisma.expense.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    )
  }
}
