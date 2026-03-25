/**
 * vitest.config.ts — Configuração do Vitest (testes unitários)
 *
 * Vitest é um framework de testes compatível com Vite (mesmo bundler que usamos).
 * Vantagens: rápido, suporta TypeScript nativo, API compatível com Jest.
 *
 * Estrutura de pastas dos testes:
 * - tests/unit/ → testes unitários (rodam com Vitest)
 * - tests/e2e/  → testes end-to-end (rodam com Playwright)
 *
 * Para rodar: npx vitest (ou npx vitest run para CI)
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Padrão glob: busca arquivos .test.ts dentro de tests/unit/
    include: ['tests/unit/**/*.test.ts'],
    // Ambiente Node.js (não precisa de DOM para testar validação)
    environment: 'node'
  }
})
