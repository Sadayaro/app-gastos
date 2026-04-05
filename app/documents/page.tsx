"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Search, Upload, FileImage, File, Filter } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"

const documents = [
  {
    id: "1",
    fileName: "boleta_luz_enero.pdf",
    fileType: "application/pdf",
    fileSize: 245000,
    userId: "1",
    expenseId: "3",
    isVerified: true,
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "2",
    fileName: "arriendo_enero.png",
    fileType: "image/png",
    fileSize: 1200000,
    userId: "1",
    expenseId: "1",
    isVerified: true,
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "3",
    fileName: "supermercado_lider.jpg",
    fileType: "image/jpeg",
    fileSize: 890000,
    userId: "1",
    expenseId: "2",
    isVerified: false,
    createdAt: new Date("2026-01-14"),
  },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage
  return FileText
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "pdf" && doc.fileType === "application/pdf") ||
      (typeFilter === "image" && doc.fileType.startsWith("image/"))
    return matchesSearch && matchesType
  })

  const totalSize = documents.reduce((acc, doc) => acc + doc.fileSize, 0)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Documentos</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Gestiona boletas, facturas y comprobantes
            </p>
          </div>
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger
              render={<Button className="btn-gradient" />}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Documento
            </DialogTrigger>
            <DialogContent className="card-premium border-none">
              <DialogHeader>
                <DialogTitle className="text-xl">Subir Documento</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Sube boletas, facturas o comprobantes de pago
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG hasta 10MB
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gasto asociado</label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-none">
                      <SelectValue placeholder="Seleccionar gasto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Arriendo Departamento</SelectItem>
                      <SelectItem value="2">Supermercado Lider</SelectItem>
                      <SelectItem value="3">Cuenta de Luz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="btn-gradient">Subir Documento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="card-premium border-none">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-none"
                />
              </div>
              <Select
                value={typeFilter}
                onValueChange={(val) => setTypeFilter(val || "all")}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-none">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo de archivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Imágenes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="grid gap-4">
          {filteredDocuments.length === 0 ? (
            <Card className="card-premium border-none">
              <CardContent className="py-12 text-center">
                <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No se encontraron documentos</p>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => {
              const Icon = getFileIcon(doc.fileType)
              return (
                <Card
                  key={doc.id}
                  className="card-premium card-premium-hover cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(doc.fileSize)} •{" "}
                          {formatDistanceToNow(doc.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {doc.isVerified && (
                        <span className="text-xs px-2 py-1 rounded-full bg-status-paid/20 text-status-paid">
                          Verificado
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-premium border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{documents.length}</p>
            </CardContent>
          </Card>
          <Card className="card-premium border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Espacio Utilizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">
                {formatFileSize(totalSize)}
              </p>
            </CardContent>
          </Card>
          <Card className="card-premium border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Verificados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.isVerified).length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
