import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get("title") as string
    const amount = parseFloat(formData.get("amount") as string)
    const categoryId = formData.get("categoryId") as string | null
    const branchId = formData.get("branchId") as string

    if (!title || isNaN(amount) || !branchId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        branchId,
        categoryId,
        status: "pending",
        expenseDate: new Date(),
        currency: "CLP",
        createdBy: "temp-user-id", // TODO: Replace with actual auth
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    )
  }
}
