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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Wallet } from "lucide-react"

const incomeSources = [
  { value: "salary", label: "Salario" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Inversión" },
  { value: "business", label: "Negocio" },
  { value: "gift", label: "Regalo" },
  { value: "other", label: "Otro" },
]

export default function CreateIncomeDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [source, setSource] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.set("source", source)
    formData.set("isRecurring", isRecurring ? "on" : "")
    
    try {
      const response = await fetch('/api/incomes', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        setIsOpen(false)
        setSource("")
        setIsRecurring(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear ingreso')
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
        Nuevo Ingreso
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="card-premium border-none">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Wallet className="h-5 w-5 text-status-paid" />
                Registrar Ingreso
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Registra un nuevo ingreso o revenue
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Pago mensual cliente X"
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
                  <Label htmlFor="source">Origen</Label>
                  <Select value={source} onValueChange={(v) => setSource(v || "")} required>
                    <SelectTrigger className="bg-secondary border-none">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeSources.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="source" value={source} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Detalles adicionales..."
                  className="bg-secondary border-none"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={isRecurring}
                  onCheckedChange={(checked: boolean | "indeterminate") => setIsRecurring(checked === true)}
                />
                <Label htmlFor="isRecurring" className="text-sm font-normal cursor-pointer">
                  Ingreso recurrente (mensual)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Ingreso'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
