import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  // O terceiro parâmetro '' permite carregar todas as variáveis, independente do prefixo
  // Fix: Use '.' instead of process.cwd() to avoid type issues if process is shadowed
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Isso faz a mágica: substitui 'process.env.API_KEY' no seu código
      // pelo valor da variável VITE_API_KEY configurada na Vercel
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY),
    },
  }
})