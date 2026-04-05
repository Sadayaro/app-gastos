import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const expenseId = formData.get("expenseId") as string

    if (!file || !expenseId) {
      return NextResponse.json(
        { error: "File and expenseId are required" },
        { status: 400 }
      )
    }

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

    // Upload to Vercel Blob
    const blob = await put(`documents/${session.user.id}/${expenseId}/${file.name}`, file, {
      access: "public",
    })

    // Save document record in database
    const document = await prisma.document.create({
      data: {
        expenseId,
        userId: session.user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: BigInt(file.size),
        storageKey: blob.pathname,
        storageUrl: blob.url,
      },
    })

    // Update expense hasDocument flag
    await prisma.expense.update({
      where: { id: expenseId },
      data: { hasDocument: true },
    })

    return NextResponse.json({
      id: document.id,
      fileName: document.fileName,
      fileType: document.fileType,
      fileSize: Number(document.fileSize),
      url: blob.url,
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    // Verify the document belongs to the user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: session.user.id,
      },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    )
  }
}
