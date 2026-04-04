import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: expenseId } = await params
    const formData = await request.formData()
    
    const userId = formData.get("userId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const percentage = formData.get("percentage") ? parseFloat(formData.get("percentage") as string) : null

    if (!userId || isNaN(amount)) {
      return NextResponse.json(
        { error: "Usuario y monto son requeridos" },
        { status: 400 }
      )
    }

    // Update expense to mark as split
    await prisma.expense.update({
      where: { id: expenseId },
      data: { isSplit: true, splitType: percentage ? "percentage" : "amount" },
    })

    const split = await prisma.expenseSplit.create({
      data: {
        expenseId,
        userId,
        amount,
        percentage: percentage || null,
        status: "pending",
      },
    })

    return NextResponse.json(split, { status: 201 })
  } catch (error) {
    console.error("Error creating expense split:", error)
    return NextResponse.json(
      { error: "Failed to create split" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: expenseId } = await params
    
    const splits = await prisma.expenseSplit.findMany({
      where: { expenseId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    })

    return NextResponse.json(splits)
  } catch (error) {
    console.error("Error fetching expense splits:", error)
    return NextResponse.json(
      { error: "Failed to fetch splits" },
      { status: 500 }
    )
  }
}
