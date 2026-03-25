/**
 * app.spec.ts — Testes End-to-End (E2E) com Playwright
 *
 * Estes testes abrem o app Electron REAL e interagem com ele
 * como um usuário faria (clicar botões, verificar texto, etc.).
 *
 * Diferença dos unitários:
 * - Unitários: rápidos, testam funções isoladas
 * - E2E: mais lentos, mas testam o fluxo completo real
 *
 * Pré-requisito: o app precisa ter sido buildado:
 *   npm run build
 *
 * Para rodar:
 *   npx playwright test
 *
 * API do Playwright para Electron:
 * - `electron.launch()`: abre o app Electron
 * - `electronApp.firstWindow()`: obtém a janela principal
 * - `window.waitForSelector()`: espera um elemento aparecer
 * - `window.click()`: clica em um elemento
 * - `window.textContent()`: lê o texto de um elemento
 */

import { test, expect, _electron as electron } from '@playwright/test'
import { join } from 'path'

// test.describe() agrupa testes relacionados (equivalente ao describe() do Vitest)
test.describe('Electron Notas E2E', () => {
  // Teste 1: Verifica se a janela abre com o título correto
  test('a janela abre com o título correto', async () => {
    // Abre o app Electron apontando para o build compilado
    const electronApp = await electron.launch({
      args: [join(__dirname, '../../out/main/index.js')]
    })

    // firstWindow() retorna a primeira BrowserWindow que abrir
    const window = await electronApp.firstWindow()
    const title = await window.title()
    expect(title).toBe('Electron Notas')

    // IMPORTANTE: sempre feche o app no final de cada teste
    await electronApp.close()
  })

  // Teste 2: Verifica se o título "Notas" aparece na sidebar
  test('mostra o título "Notas" na sidebar', async () => {
    const electronApp = await electron.launch({
      args: [join(__dirname, '../../out/main/index.js')]
    })

    const window = await electronApp.firstWindow()
    // waitForSelector() espera até o elemento existir no DOM
    await window.waitForSelector('.sidebar-header h1')

    const heading = await window.textContent('.sidebar-header h1')
    expect(heading).toBe('Notas')

    await electronApp.close()
  })

  // Teste 3: Verifica se clicar em "+ Nova" cria uma nota
  test('cria uma nova nota ao clicar no botão', async () => {
    const electronApp = await electron.launch({
      args: [join(__dirname, '../../out/main/index.js')]
    })

    const window = await electronApp.firstWindow()
    await window.waitForSelector('.btn-new')

    // Conta quantas notas existem antes
    const notesBefore = await window.$$('.note-item')
    const countBefore = notesBefore.length

    // Clica no botão "+ Nova"
    await window.click('.btn-new')

    // Espera um pouco (o IPC é assíncrono)
    await window.waitForTimeout(500)

    // Verifica que agora tem uma nota a mais
    const notesAfter = await window.$$('.note-item')
    expect(notesAfter.length).toBe(countBefore + 1)

    await electronApp.close()
  })
})

// DESAFIO: Adicione um teste que verifica se deletar uma nota
// reduz o contador. Dica: crie uma nota, delete-a, e verifique o count.
