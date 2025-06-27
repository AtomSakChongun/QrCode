import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/AtomSakChongun/QrCode/',  // แก้ให้ตรง repo path
  plugins: [react()],
})
