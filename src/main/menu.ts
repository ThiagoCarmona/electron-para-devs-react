/**
 * menu.ts — Menu nativo da aplicação
 *
 * O Electron permite criar menus nativos (aqueles que aparecem no topo da janela
 * no Windows/Linux ou na barra de menu do macOS). Usamos `Menu.buildFromTemplate()`
 * para declarar a estrutura de forma descritiva.
 *
 * Conceitos-chave:
 * - `role`: atalhos para ações padrão do sistema (copiar, colar, sair, etc.)
 * - `accelerator`: atalho de teclado personalizado (ex.: "CmdOrCtrl+N")
 * - `click`: callback executado quando o item é clicado
 * - `webContents.send()`: envia uma mensagem IPC do main → renderer (direção inversa
 *   do invoke/handle que já usamos). O renderer escuta com `ipcRenderer.on()`.
 *
 * macOS vs Windows/Linux:
 * No macOS, o primeiro item do menu é sempre o nome do app. Por isso usamos
 * um spread condicional (`...isMac ? [...]  : []`) para incluí-lo apenas no Mac.
 */

import { Menu, BrowserWindow, app } from 'electron'

export function createAppMenu(mainWindow: BrowserWindow): void {
  const isMac = process.platform === 'darwin'

  const template: Electron.MenuItemConstructorOptions[] = [
    // No macOS, o primeiro menu leva o nome do app — é uma convenção do sistema
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

    // Menu "Arquivo" — ações relacionadas a notas
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Nova Nota',
          accelerator: 'CmdOrCtrl+N',
          // webContents.send() envia uma mensagem do main process → renderer process.
          // Este é o padrão de IPC bidirecional: o renderer escuta com ipcRenderer.on()
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
        // No macOS, "fechar" só fecha a janela (o app continua no dock).
        // No Windows/Linux, "sair" encerra o app completamente.
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },

    // Menu "Editar" — usa roles padrão do Electron para ações de clipboard
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

    // Menu "Visualizar" — reload, DevTools e zoom
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

  // buildFromTemplate() transforma o array declarativo em um objeto Menu do Electron
  const menu = Menu.buildFromTemplate(template)

  // setApplicationMenu() define este menu como o menu global da aplicação
  Menu.setApplicationMenu(menu)
}
