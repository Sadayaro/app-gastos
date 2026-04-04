# Variables de Entorno - App Gastos

## Configuración Supabase

Crea un proyecto en [Supabase](https://supabase.com) y configura estas variables:

### Para Vercel (Production)

En tu dashboard de Vercel, agrega estas Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-privada
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.tu-proyecto.supabase.co:5432/postgres
```

### Obtener las credenciales:

1. Ve a tu proyecto en Supabase Dashboard
2. **Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL del proyecto
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret (solo servidor)

3. **Settings > Database > Connection String**:
   - Usa la URL de conexión directa (puerto 5432)
   - Formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

## Configuración Local

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.tu-proyecto.supabase.co:5432/postgres
```

## Migraciones de Base de Datos

Para aplicar el schema a Supabase:

```bash
# Generar cliente Prisma
npx prisma generate

# Crear y aplicar migraciones
npx prisma migrate dev --name init

# O usar Prisma con Supabase directamente
npx prisma db push
```

## Seguridad RLS (Row Level Security)

Activa RLS en Supabase para cada tabla:

```sql
-- Ejemplo para tabla expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Política: usuarios solo ven gastos de sus sucursales
CREATE POLICY "Users can view branch expenses" ON expenses
  FOR SELECT USING (
    branch_id IN (
      SELECT branch_id FROM branch_members WHERE user_id = auth.uid()
    )
  );
```
