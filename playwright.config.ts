/**
 * playwright.config.ts — Configuração do Playwright (testes E2E)
 *
 * Playwright é uma ferramenta de automação de browser que também suporta
 * apps Electron via `_electron.launch()`.
 *
 * Diferença entre unitários e E2E:
 * - Unitários: testam funções isoladas (ex.: validateId('abc') retorna true)
 * - E2E: testam o app REAL rodando (ex.: clicar no botão cria uma nota)
 *
 * IMPORTANTE: os testes E2E requerem que o app tenha sido buildado:
 *   npm run build      (compila o app)
 *   npx playwright test (roda os testes E2E)
 *
 * Para rodar: npx playwright test
 */

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',      // Pasta com os testes E2E
  timeout: 30000,             // 30s de timeout (apps Electron podem demorar para abrir)
  retries: 1,                 // Retenta 1x em caso de falha (testes E2E são instáveis às vezes)
  use: {
    // Grava um trace (screenshot + DOM + rede) na primeira retentativa
    // Útil para debugar por que um teste falhou
    trace: 'on-first-retry'
  }
})
