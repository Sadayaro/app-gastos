import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      amount,
      source,
      categoryId,
      description,
      incomeDate,
      isRecurring,
      recurrenceType,
    } = body

    if (!title || typeof amount !== "number" || !source) {
      return NextResponse.json(
        { error: "Título, monto y fuente son requeridos" },
        { status: 400 }
      )
    }

    const income = await prisma.income.create({
      data: {
        title,
        amount,
        source,
        categoryId,
        description,
        isRecurring: isRecurring || false,
        recurrenceType,
        incomeDate: incomeDate ? new Date(incomeDate) : new Date(),
        currency: "CLP",
        userId: "temp-user-id", // TODO: Replace with actual auth
      },
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error("Error creating income:", error)
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    const incomes = await prisma.income.findMany({
      where: userId ? { userId } : {},
      orderBy: { incomeDate: "desc" },
      include: {
        category: true,
      },
    })

    return NextResponse.json(incomes)
  } catch (error) {
    console.error("Error fetching incomes:", error)
    return NextResponse.json(
      { error: "Failed to fetch incomes" },
      { status: 500 }
    )
  }
}
