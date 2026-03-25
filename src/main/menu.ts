/**
 * menu.ts — Menu nativo da aplicação
 *
 * Conceitos-chave:
 * - `role`: atalhos para ações padrão do sistema (copiar, colar, sair, etc.)
 * - `accelerator`: atalho de teclado personalizado (ex.: "CmdOrCtrl+N")
 * - `click` + `webContents.send()`: IPC main → renderer
 */

import { Menu, BrowserWindow, app } from 'electron'

export function createAppMenu(mainWindow: BrowserWindow): void {
  const isMac = process.platform === 'darwin'

  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              { role: 'quit' as const }
            ]
          }
        ]
      : []),
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Nova Nota',
          accelerator: 'CmdOrCtrl+N',
          click: (): void => {
            mainWindow.webContents.send('menu:newNote')
          }
        },
        { type: 'separator' },
        {
          label: 'Exportar Nota...',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: (): void => {
            mainWindow.webContents.send('menu:exportNote')
          }
        },
        {
          label: 'Importar Nota...',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: (): void => {
            mainWindow.webContents.send('menu:importNote')
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
