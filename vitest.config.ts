import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Testes unitários ficam na pasta tests/
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node'
  }
})
