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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Home, Briefcase, Palmtree, Plus } from "lucide-react"

const branchTypes = [
  { value: "home", label: "Hogar", icon: Home },
  { value: "office", label: "Oficina", icon: Briefcase },
  { value: "vacation", label: "Vacaciones", icon: Palmtree },
  { value: "business", label: "Negocio", icon: Building2 },
]

const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"]

export default function CreateBranchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(colors[0])

  async function handleSubmit(formData: FormData) {
    formData.append("color", selectedColor)
    // Submit to server action
    const response = await fetch('/api/branches', {
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
        Nueva Sucursal
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="card-premium border-none">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Crear Nueva Sucursal</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Configura un nuevo espacio para gestionar sus gastos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="Ej: Casa de Playa"
                className="bg-secondary border-none"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" required>
                <SelectTrigger className="bg-secondary border-none">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {branchTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input 
                id="description" 
                name="description"
                placeholder="Breve descripción del espacio"
                className="bg-secondary border-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Color identificador</Label>
              <div className="flex gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-gradient">
              Crear Sucursal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
