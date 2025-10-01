import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pruebaQr/', // 👈 debe coincidir EXACTO con el nombre del repo
})