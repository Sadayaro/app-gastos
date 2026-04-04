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
import { Users, Split } from "lucide-react"

interface SplitExpenseDialogProps {
  expenseId: string
  expenseTitle: string
  expenseAmount: number
  onSplitCreated?: () => void
}

export default function SplitExpenseDialog({ 
  expenseId, 
  expenseTitle, 
  expenseAmount,
  onSplitCreated 
}: SplitExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [splits, setSplits] = useState<{ userName: string; amount: string; percentage?: string }[]>([
    { userName: "", amount: "" }
  ])

  function addSplit() {
    setSplits([...splits, { userName: "", amount: "" }])
  }

  function removeSplit(index: number) {
    setSplits(splits.filter((_, i) => i !== index))
  }

  function updateSplit(index: number, field: keyof typeof splits[0], value: string) {
    const newSplits = [...splits]
    newSplits[index][field] = value
    setSplits(newSplits)
  }

  function calculateEqualSplit() {
    const equalAmount = expenseAmount / splits.length
    setSplits(splits.map(s => ({ ...s, amount: equalAmount.toFixed(0), percentage: (100 / splits.length).toFixed(1) })))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      for (const split of splits) {
        if (!split.userName || !split.amount) continue
        
        const formData = new FormData()
        formData.set("userId", `user-${split.userName.toLowerCase().replace(/\s+/g, '-')}`)
        formData.set("amount", split.amount)
        if (split.percentage) {
          formData.set("percentage", split.percentage)
        }
        
        const response = await fetch(`/api/expenses/${expenseId}/split`, {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error('Error creating split')
        }
      }
      
      setIsOpen(false)
      setSplits([{ userName: "", amount: "" }])
      onSplitCreated?.()
      window.location.reload()
    } catch (error) {
      alert('Error al dividir gasto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSplit = splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
  const isBalanced = Math.abs(totalSplit - expenseAmount) < 0.01

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="gap-1">
        <Split className="h-4 w-4" />
        Dividir
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="card-premium border-none max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Dividir Gasto
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {expenseTitle} - Total: ${expenseAmount.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={calculateEqualSplit}>
                  Dividir Equitativamente
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addSplit}>
                  + Agregar Persona
                </Button>
              </div>
              
              {splits.map((split, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Persona {index + 1}</Label>
                    <Input
                      value={split.userName}
                      onChange={(e) => updateSplit(index, "userName", e.target.value)}
                      placeholder="Nombre"
                      className="bg-secondary border-none"
                      required
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Monto</Label>
                    <Input
                      type="number"
                      value={split.amount}
                      onChange={(e) => updateSplit(index, "amount", e.target.value)}
                      placeholder="0"
                      className="bg-secondary border-none"
                      required
                    />
                  </div>
                  <div className="w-20 space-y-1">
                    <Label className="text-xs">%</Label>
                    <Input
                      type="number"
                      value={split.percentage || ""}
                      onChange={(e) => updateSplit(index, "percentage", e.target.value)}
                      placeholder="%"
                      className="bg-secondary border-none"
                    />
                  </div>
                  {splits.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeSplit(index)}
                      className="text-red-500"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              
              <div className={`text-sm text-center py-2 rounded ${isBalanced ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                Total asignado: ${totalSplit.toLocaleString()} / ${expenseAmount.toLocaleString()}
                {!isBalanced && " (Desbalanceado)"}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="btn-gradient" 
                disabled={isSubmitting || !isBalanced}
              >
                {isSubmitting ? 'Guardando...' : 'Dividir Gasto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
