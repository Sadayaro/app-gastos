import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        notificationSettings: {
          sevenDays: true,
          fortyEightHours: true,
          sameDay: true,
          pushEnabled: true,
        },
      },
    })

    // Create default user preferences
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        theme: "dark",
        accentColor: "indigo",
        emailEnabled: true,
        pushEnabled: true,
        sevenDaysAlert: true,
        fortyEightHoursAlert: true,
        sameDayAlert: true,
        overdueAlert: true,
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Error al crear la cuenta" },
      { status: 500 }
    )
  }
}
