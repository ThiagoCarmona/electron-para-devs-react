/**
 * index.ts — Main Process (ponto de entrada do Electron)
 *
 * Nesta lição adicionamos:
 * - Menu nativo personalizado (menu.ts)
 * - Ícone na bandeja do sistema / System Tray (tray.ts)
 * - Exportar/Importar notas via dialog nativo do sistema
 * - Notificações nativas do sistema operacional
 * - IPC bidirecional: main → renderer (webContents.send) + renderer → main (invoke/handle)
 *
 * Novos módulos do Electron usados:
 * - `dialog`: abre diálogos nativos de salvar/abrir arquivo
 * - `Notification`: exibe notificações do sistema (aquelas que aparecem no canto da tela)
 * - `writeFileSync / readFileSync`: Node.js para ler/escrever arquivos
 */

import { app, shell, BrowserWindow, ipcMain, dialog, Notification } from 'electron'
import { join } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { IPC_CHANNELS } from '../shared/types'
import { getAllNotes, createNote, updateNote, deleteNote } from './notes'
import { closeDatabase } from './database'
import { createAppMenu } from './menu'
import { createTray } from './tray'

let mainWindow: BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false, // Mostramos o menu nativo (que agora tem itens personalizados)
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Configura o menu nativo e o tray (novos nesta lição!)
  createAppMenu(mainWindow)
  createTray(mainWindow)
}

/**
 * Registra todos os handlers de IPC.
 *
 * Nesta lição, além do CRUD de notas, temos novos handlers para:
 * - Exportar/Importar: usam `dialog` para abrir/salvar arquivos do sistema
 * - Notificações: usam a API `Notification` do Electron
 */
function registerIpcHandlers(): void {
  // ── CRUD de notas (igual à lição anterior) ──
  ipcMain.handle(IPC_CHANNELS.NOTES_GET_ALL, () => getAllNotes())
  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, (_, title: string, content: string) =>
    createNote(title, content)
  )
  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, (_, id: string, title: string, content: string) =>
    updateNote(id, title, content)
  )
  ipcMain.handle(IPC_CHANNELS.NOTES_DELETE, (_, id: string) => deleteNote(id))

  // ── Exportar nota como arquivo .txt/.md ──
  // dialog.showSaveDialog() abre o diálogo nativo de "Salvar como..." do sistema operacional.
  // É assíncrono e retorna { canceled, filePath }.
  ipcMain.handle(
    IPC_CHANNELS.NOTES_EXPORT,
    async (_, title: string, content: string) => {
      const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Exportar Nota',
        defaultPath: `${title || 'nota'}.txt`,
        filters: [
          { name: 'Texto', extensions: ['txt'] },
          { name: 'Markdown', extensions: ['md'] }
        ]
      })

      if (canceled || !filePath) return false

      // writeFileSync é do Node.js (fs) — funciona porque estamos no main process
      writeFileSync(filePath, `# ${title}\n\n${content}`, 'utf-8')
      return true
    }
  )

  // ── Importar nota de arquivo .txt/.md ──
  // dialog.showOpenDialog() abre o diálogo nativo de "Abrir arquivo..."
  ipcMain.handle(IPC_CHANNELS.NOTES_IMPORT, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar Nota',
      filters: [{ name: 'Texto', extensions: ['txt', 'md'] }],
      properties: ['openFile']
    })

    if (canceled || filePaths.length === 0) return null

    // Lê o conteúdo do arquivo selecionado
    const content = readFileSync(filePaths[0], 'utf-8')

    // Extrai o nome do arquivo (sem extensão) para usar como título da nota
    const fileName = filePaths[0].split(/[\\\/]/).pop() || 'Nota importada'
    const title = fileName.replace(/\.(txt|md)$/, '')

    // Cria a nota no banco de dados e retorna para o renderer
    return createNote(title, content)
  })

  // ── Notificação nativa ──
  // A API Notification do Electron usa o sistema de notificações do SO
  // (Central de Ações no Windows, Notification Center no macOS, etc.)
  ipcMain.handle(
    IPC_CHANNELS.APP_SHOW_NOTIFICATION,
    (_, title: string, body: string) => {
      new Notification({ title, body }).show()
      return true
    }
  )
}

// ── Inicialização do app ──
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Registra handlers antes de criar a janela (boa prática)
  registerIpcHandlers()
  createWindow()

  // macOS: re-cria a janela se o app é ativado sem janelas abertas
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Windows/Linux: encerra o app quando todas as janelas são fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Fecha o banco de dados antes de encerrar (evita corrupção de dados)
app.on('before-quit', () => {
  closeDatabase()
})
