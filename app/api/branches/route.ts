import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const description = formData.get("description") as string | null
    const color = formData.get("color") as string

    if (!name || !type) {
      return NextResponse.json(
        { error: "Nombre y tipo son requeridos" },
        { status: 400 }
      )
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        type,
        description,
        color: color || "#6366F1",
        ownerId: "temp-user-id", // TODO: Replace with actual auth
        currency: "CLP",
      },
    })

    return NextResponse.json(branch, { status: 201 })
  } catch (error) {
    console.error("Error creating branch:", error)
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    )
  }
}
