import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FinTrack Pro',
    short_name: 'FinTrack',
    description: 'Sistema ultra-premium de gestión de gastos multi-sucursal',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#6366f1',
    orientation: 'portrait',
    scope: '/',
    lang: 'es',
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Nuevo Gasto',
        short_name: 'Gasto',
        description: 'Registrar un nuevo gasto',
        url: '/expenses',
        icons: [{ src: '/icons/shortcut-expense.png', sizes: '192x192' }],
      },
      {
        name: 'Sucursales',
        short_name: 'Sucursales',
        description: 'Ver sucursales',
        url: '/branches',
        icons: [{ src: '/icons/shortcut-branch.png', sizes: '192x192' }],
      },
    ],
  }
}
