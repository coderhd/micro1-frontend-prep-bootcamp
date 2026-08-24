import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/micro1-frontend-prep-bootcamp/',
	plugins: [react()],
})
