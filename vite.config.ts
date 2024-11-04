import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import { getDirname } from '@adonisjs/core/helpers'

export default defineConfig({
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['inertia/css/app.css', 'inertia/app/app.tsx'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
  ],
  resolve: {
    alias: {
      '@/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
