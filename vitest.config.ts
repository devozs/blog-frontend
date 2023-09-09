import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [Vue()],
    test: {
        globals: true,
        coverage: {
            reporter: ['text', 'json-summary', 'json'],
          }
      
    }
})