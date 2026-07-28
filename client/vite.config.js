import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Dev server and standard hosts (Vercel/Render/Netlify) serve from root.
  // Only a GitHub Pages build (GH_PAGES=true npm run build) needs the repo sub-path.
  base: command === 'build' && process.env.GH_PAGES ? '/campus-buddy/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production for better performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['axios', 'react-hot-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
}))