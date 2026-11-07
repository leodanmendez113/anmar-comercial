import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// La web vive en la raíz de comercial.anmarproductions.com.
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: 'Anmar Comercial — Grabación para marcas',
        short_name: 'Anmar Comercial',
        description: 'Paquetes de grabación de contenido para marcas y negocios.',
        lang: 'es',
        theme_color: '#0C0C0E',
        background_color: '#0C0C0E',
        display: 'standalone',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallbackDenylist: [/^\/datos\//],
        runtimeCaching: [
          {
            // Los paquetes siempre se piden frescos; la copia guardada solo se usa sin señal.
            urlPattern: /\/datos\/.*\.json/,
            handler: 'NetworkFirst',
            options: { cacheName: 'datos', networkTimeoutSeconds: 4 }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'fuentes', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ]
})
