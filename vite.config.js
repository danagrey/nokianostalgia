import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/nokianostalgia/'  // <- Add this line (matches your repo name)
});
