import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-center">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
