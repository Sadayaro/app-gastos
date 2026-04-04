"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

export default function CreateExpenseDialog() {
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      body: formData,
    })
    if (response.ok) {
      setIsOpen(false)
      window.location.reload()
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="btn-gradient">
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Gasto
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="card-premium border-none">
          <form action={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl">Crear Nuevo Gasto</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Registra un nuevo gasto para tu sucursal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Arriendo enero"
                  className="bg-secondary border-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="0"
                    className="bg-secondary border-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select name="categoryId">
                    <SelectTrigger className="bg-secondary border-none">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="housing">Vivienda</SelectItem>
                      <SelectItem value="food">Alimentación</SelectItem>
                      <SelectItem value="transport">Transporte</SelectItem>
                      <SelectItem value="services">Servicios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Sucursal</Label>
                <Select name="branchId" required>
                  <SelectTrigger className="bg-secondary border-none">
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Casa Principal</SelectItem>
                    <SelectItem value="2">Oficina Centro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-gradient">
                Crear Gasto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
