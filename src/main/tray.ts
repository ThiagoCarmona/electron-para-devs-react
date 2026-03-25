/**
 * tray.ts — Ícone na bandeja do sistema (System Tray)
 *
 * O tray é o ícone ao lado do relógio no Windows/Linux ou na barra de menus no macOS.
 * Permite acesso rápido ao app sem abrir a janela.
 */

import { Tray, Menu, BrowserWindow, nativeImage } from 'electron'

let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow): void {
  const icon = nativeImage.createEmpty()

  tray = new Tray(icon)
  tray.setToolTip('Electron Notas')

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
        mainWindow.webContents.send('menu:newNote')
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: (): void => {
        mainWindow.destroy()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}
