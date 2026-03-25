import { test, expect, _electron as electron } from '@playwright/test'
import { join } from 'path'

// Estes testes requerem que o app tenha sido buildado: npm run build
test.describe('Electron Notas E2E', () => {
  test('a janela abre com o título correto', async () => {
    const electronApp = await electron.launch({
      args: [join(__dirname, '../../out/main/index.js')]
    })

    const window = await electronApp.firstWindow()
    const title = await window.title()
    expect(title).toBe('Electron Notas')

    await electronApp.close()
  })

  test('mostra o título "Notas" na sidebar', async () => {
    const electronApp = await electron.launch({
      args: [join(__dirname, '../../out/main/index.js')]
    })

    const window = await electronApp.firstWindow()
    await window.waitForSelector('.sidebar-header h1')

    const heading = await window.textContent('.sidebar-header h1')
    expect(heading).toBe('Notas')

    await electronApp.close()
  })

  test('cria uma nova nota ao clicar no botão', async () => {
    const electronApp = await electron.launch({
      args: [join(__dirname, '../../out/main/index.js')]
    })

    const window = await electronApp.firstWindow()
    await window.waitForSelector('.btn-new')

    // Conta notas antes
    const notesBefore = await window.$$('.note-item')
    const countBefore = notesBefore.length

    // Clica em "+ Nova"
    await window.click('.btn-new')

    // Espera a nova nota aparecer
    await window.waitForTimeout(500)
    const notesAfter = await window.$$('.note-item')

    expect(notesAfter.length).toBe(countBefore + 1)

    await electronApp.close()
  })
})
