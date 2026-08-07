import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Respeita a porta atribuída pelo ambiente (PORT); cai no padrão do Vite se ausente.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
})
