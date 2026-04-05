import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expenseId = id

    // Verify the expense belongs to the user
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: session.user.id,
      },
    })

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    // Update expense as paid
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        status: "paid",
        paidAt: new Date(),
      },
    })

    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error("Error marking expense as paid:", error)
    return NextResponse.json(
      { error: "Failed to mark expense as paid" },
      { status: 500 }
    )
  }
}
