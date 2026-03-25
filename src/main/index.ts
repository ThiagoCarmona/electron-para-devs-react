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
    autoHideMenuBar: false, // Agora mostramos o menu
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

  // Configura menu e tray
  createAppMenu(mainWindow)
  createTray(mainWindow)
}

function registerIpcHandlers(): void {
  // CRUD de notas
  ipcMain.handle(IPC_CHANNELS.NOTES_GET_ALL, () => getAllNotes())
  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, (_, title: string, content: string) => createNote(title, content))
  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, (_, id: string, title: string, content: string) => updateNote(id, title, content))
  ipcMain.handle(IPC_CHANNELS.NOTES_DELETE, (_, id: string) => deleteNote(id))

  // Exportar nota como arquivo .txt
  ipcMain.handle(IPC_CHANNELS.NOTES_EXPORT, async (_, title: string, content: string) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar Nota',
      defaultPath: `${title || 'nota'}.txt`,
      filters: [
        { name: 'Texto', extensions: ['txt'] },
        { name: 'Markdown', extensions: ['md'] }
      ]
    })

    if (canceled || !filePath) return false

    writeFileSync(filePath, `# ${title}\n\n${content}`, 'utf-8')
    return true
  })

  // Importar nota de arquivo .txt/.md
  ipcMain.handle(IPC_CHANNELS.NOTES_IMPORT, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar Nota',
      filters: [
        { name: 'Texto', extensions: ['txt', 'md'] }
      ],
      properties: ['openFile']
    })

    if (canceled || filePaths.length === 0) return null

    const content = readFileSync(filePaths[0], 'utf-8')
    const fileName = filePaths[0].split(/[\\/]/).pop() || 'Nota importada'
    const title = fileName.replace(/\.(txt|md)$/, '')

    return createNote(title, content)
  })

  // Notificação
  ipcMain.handle(IPC_CHANNELS.APP_SHOW_NOTIFICATION, (_, title: string, body: string) => {
    new Notification({ title, body }).show()
    return true
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  closeDatabase()
})
