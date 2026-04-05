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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryId, setCategoryId] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.set("categoryId", categoryId)
    
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        setIsOpen(false)
        setCategoryId("")
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear gasto')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setIsSubmitting(false)
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
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl">Crear Nuevo Gasto</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Registra un nuevo gasto
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
                  <Select value={categoryId} onValueChange={(v) => setCategoryId(v || "")}>
                    <SelectTrigger className="bg-secondary border-none">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Hogar</SelectItem>
                      <SelectItem value="services">Servicios</SelectItem>
                      <SelectItem value="entertainment">Entretenimiento</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="health">Salud</SelectItem>
                      <SelectItem value="transport">Transporte</SelectItem>
                      <SelectItem value="food">Alimentación</SelectItem>
                      <SelectItem value="shopping">Compras</SelectItem>
                      <SelectItem value="other">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="categoryId" value={categoryId} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de vencimiento</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="bg-secondary border-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Gasto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
