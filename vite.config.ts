import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente
  // Using '.' instead of process.cwd() to avoid TS errors regarding 'process' types
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Substituição em tempo de build para compatibilidade com bibliotecas que exigem process.env
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY),
    },
  }
})