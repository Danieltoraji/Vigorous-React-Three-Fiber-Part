import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 以后你在 React 里写 fetch('/api/...')
      // Vite 会自动把它转发到 http://localhost:8000/api/...，打包前后就不用改代码了
      '/api': 'http://localhost:8000',
    }
  }
})
