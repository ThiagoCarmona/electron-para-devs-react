import { app, shell, BrowserWindow, ipcMain, dialog, Notification, session } from 'electron'
import { join } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { IPC_CHANNELS } from '../shared/types'
import { getAllNotes, createNote, updateNote, deleteNote } from './notes'
import { closeDatabase } from './database'
import { createAppMenu } from './menu'
import { createTray } from './tray'
import { validateNoteInput, validateId, sanitizeString } from './validation'

let mainWindow: BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // Segurança: desabilita integração com Node no renderer
      nodeIntegration: false,
      // Segurança: isola o contexto do preload
      contextIsolation: true,
      // Segurança: desabilita execução remota
      enableRemoteModule: false,
      // Segurança: bloqueia navegação para URLs externas
      navigateOnDragDrop: false
    } as Electron.WebPreferences
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Segurança: abre links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Segurança: bloqueia navegação para URLs não permitidas
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowed = is.dev
      ? [process.env['ELECTRON_RENDERER_URL'] || '']
      : ['file://']

    const isAllowed = allowed.some((prefix) => url.startsWith(prefix))
    if (!isAllowed) {
      event.preventDefault()
      console.warn(`Navegação bloqueada: ${url}`)
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  createAppMenu(mainWindow)
  createTray(mainWindow)
}

function registerIpcHandlers(): void {
  // CRUD com validação de input
  ipcMain.handle(IPC_CHANNELS.NOTES_GET_ALL, () => getAllNotes())

  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, (_, title: unknown, content: unknown) => {
    const validation = validateNoteInput(title, content)
    if (!validation.valid) throw new Error(validation.error)
    return createNote(sanitizeString(title as string), sanitizeString(content as string))
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, (_, id: unknown, title: unknown, content: unknown) => {
    if (!validateId(id)) throw new Error('ID inválido')
    const validation = validateNoteInput(title, content)
    if (!validation.valid) throw new Error(validation.error)
    return updateNote(id as string, sanitizeString(title as string), sanitizeString(content as string))
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_DELETE, (_, id: unknown) => {
    if (!validateId(id)) throw new Error('ID inválido')
    return deleteNote(id as string)
  })

  // Exportar nota
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

  // Importar nota
  ipcMain.handle(IPC_CHANNELS.NOTES_IMPORT, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar Nota',
      filters: [{ name: 'Texto', extensions: ['txt', 'md'] }],
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

function configureSecurityHeaders(): void {
  // Segurança: configura headers de resposta
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
        'X-XSS-Protection': ['1; mode=block']
      }
    })
  })

  // Segurança: bloqueia permissões desnecessárias
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowedPermissions = ['clipboard-read', 'clipboard-sanitized-write']
    callback(allowedPermissions.includes(permission))
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  configureSecurityHeaders()
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
