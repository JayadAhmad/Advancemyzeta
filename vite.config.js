// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


export default defineConfig({
  plugins: [react(), ],
  server: {
    proxy: {
      "/api": {
        target: "http://jemapps.in",
        changeOrigin: true,
        secure: false,
      },
      "/__sales_api": {
        target: "http://192.168.1.110:3600",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/__sales_api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
