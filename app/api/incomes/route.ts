import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get("title") as string
    const amount = parseFloat(formData.get("amount") as string)
    const source = formData.get("source") as string
    const branchId = formData.get("branchId") as string
    const description = formData.get("description") as string | null
    const isRecurring = formData.get("isRecurring") === "on"

    if (!title || isNaN(amount) || !source || !branchId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    const income = await prisma.income.create({
      data: {
        title,
        amount,
        source,
        branchId,
        description,
        isRecurring,
        incomeDate: new Date(),
        currency: "CLP",
        createdBy: "temp-user-id", // TODO: Replace with actual auth
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
    const branchId = searchParams.get("branchId")
    
    const incomes = await prisma.income.findMany({
      where: branchId ? { branchId } : {},
      orderBy: { incomeDate: "desc" },
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
