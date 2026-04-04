"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Bell,
  Shield,
  Wallet,
  Palette,
  Save,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Personaliza tu experiencia y gestiona tu cuenta
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="card-premium border-none p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="h-4 w-4 mr-2" />
              Preferencias
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="card-premium border-none">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      placeholder="Tu nombre"
                      className="bg-secondary border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      placeholder="Tu apellido"
                      className="bg-secondary border-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-secondary border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+56 9 1234 5678"
                    className="bg-secondary border-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="btn-gradient">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-premium border-none">
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevos gastos</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones cuando se registren nuevos gastos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pagos vencidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas cuando un pago esté próximo a vencer
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Divisiones de gastos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones sobre divisiones y pagos pendientes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Resumen semanal</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe un resumen de tus gastos cada semana
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="card-premium border-none">
              <CardHeader>
                <CardTitle>Preferencias de la Aplicación</CardTitle>
                <CardDescription>
                  Personaliza tu experiencia en la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Moneda predeterminada</Label>
                  <Select defaultValue="CLP">
                    <SelectTrigger className="w-[200px] bg-secondary border-none">
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                      <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Zona horaria</Label>
                  <Select defaultValue="America/Santiago">
                    <SelectTrigger className="w-[200px] bg-secondary border-none">
                      <SelectValue placeholder="Seleccionar zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Santiago">Santiago, Chile</SelectItem>
                      <SelectItem value="America/Buenos_Aires">Buenos Aires, Argentina</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                      <SelectItem value="America/New_York">Nueva York, USA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label>Modo oscuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Usar tema oscuro por defecto
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="card-premium border-none">
              <CardHeader>
                <CardTitle>Seguridad de la Cuenta</CardTitle>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-secondary border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-secondary border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-secondary border-none"
                  />
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Cambiar Contraseña
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-none">
              <CardHeader>
                <CardTitle>Sesiones Activas</CardTitle>
                <CardDescription>
                  Gestiona tus sesiones de inicio de sesión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Este dispositivo</p>
                    <p className="text-sm text-muted-foreground">
                      Última actividad: Ahora
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-status-paid/20 text-status-paid">
                    Activo
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
