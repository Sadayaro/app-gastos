"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Lock, Mail } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implementar autenticación
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <Card className="w-full max-w-md card-premium border-none">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gradient">FinTrack Pro</CardTitle>
        <CardDescription className="text-muted-foreground">
          Inicia sesión en tu cuenta premium
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="pl-9 bg-secondary border-none"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9 bg-secondary border-none"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full btn-gradient"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <a href="#" className="text-primary hover:underline">
            Regístrate
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
