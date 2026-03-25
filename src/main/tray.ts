/**
 * tray.ts — Ícone na bandeja do sistema (System Tray)
 *
 * O "tray" é aquele pequeno ícone que fica ao lado do relógio no Windows/Linux
 * ou na barra de menus no macOS. É útil para apps que rodam em background ou
 * que o usuário quer acessar rapidamente sem abrir a janela.
 *
 * Conceitos-chave:
 * - `new Tray(icon)`: cria o ícone na bandeja. Precisa de um NativeImage.
 * - `tray.setContextMenu()`: define o menu que aparece ao clicar com botão direito.
 * - `tray.on('click')`: escuta o clique simples no ícone (toggle show/hide).
 * - `webContents.send()`: mesma técnica do menu.ts — IPC do main → renderer.
 *
 * Dica: em produção, você usaria um ícone real (PNG 16x16 ou 32x32).
 * Aqui usamos nativeImage.createEmpty() por simplicidade.
 */

import { Tray, Menu, BrowserWindow, nativeImage } from 'electron'

// Mantemos a referência em variável de módulo para evitar garbage collection
// (se o JS coletasse o Tray, o ícone desapareceria)
let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow): void {
  // Em produção, carregue um ícone real:
  //   const icon = nativeImage.createFromPath(join(__dirname, 'icon.png'))
  const icon = nativeImage.createEmpty()

  tray = new Tray(icon)
  tray.setToolTip('Electron Notas') // Tooltip ao passar o mouse

  // Menu de contexto: aparece ao clicar com botão direito no ícone
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar App',
      click: (): void => {
        mainWindow.show()
        mainWindow.focus()
      }
    },
    {
      label: 'Nova Nota',
      click: (): void => {
        mainWindow.show()
        // Envia evento IPC para o renderer criar uma nota
        mainWindow.webContents.send('menu:newNote')
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: (): void => {
        // destroy() fecha a janela forçadamente (diferente de close(), que pode
        // ser interceptado pelo evento 'close')
        mainWindow.destroy()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // Clique simples no ícone: toggle entre mostrar e esconder a janela
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}
