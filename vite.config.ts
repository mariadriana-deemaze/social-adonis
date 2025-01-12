import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import { getDirname } from '@adonisjs/core/helpers'
import { execSync } from 'node:child_process'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
    adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],
  resolve: {
    alias: {
      '@/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'generate-types',
          buildStart() {
            execSync('node ./node_modules/@izzyjs/route/build/src/generate_routes.js', {
              stdio: 'inherit',
            })
          },
        },
      ],
    },
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true, // Use polling to detect file changes in Docker volumes
    },
  },
})
