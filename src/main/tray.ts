import { Tray, Menu, BrowserWindow, nativeImage } from 'electron'
import { join } from 'path'

let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow): void {
  // Cria um ícone simples programaticamente (16x16 pixel)
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
