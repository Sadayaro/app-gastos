"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Lock, Mail, Loader2, User } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError("Credenciales inválidas")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Ocurrió un error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  async function bypassLogin() {
    setIsLoading(true)
    try {
      // Establecer cookie manualmente para bypass
      document.cookie = "next-auth.session-token=bypass-temp; path=/; max-age=86400"
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Error al entrar")
    } finally {
      setIsLoading(false)
    }
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full btn-gradient"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full"
            onClick={bypassLogin}
            disabled={isLoading}
          >
            <User className="mr-2 h-4 w-4" />
            Entrar sin registro (temporal)
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-primary hover:underline">
            Regístrate
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
