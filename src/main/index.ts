/**
 * index.ts — Main Process (Lição 09 — Logging e Debug)
 *
 * Nesta lição adicionamos:
 * - Sistema de logging com níveis (debug/info/warn/error)
 * - Logs gravados em arquivo para diagnóstico em produção
 * - DevTools abrem automaticamente em dev
 * - Captura de crashes do renderer
 * - Captura de erros não tratados (uncaughtException, unhandledRejection)
 * - Logs em cada handler IPC para rastrear operações
 */

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
import { logger, setLogLevel } from './logger'

let mainWindow: BrowserWindow

// Configura nível de log baseado no ambiente:
// dev = debug (mostra tudo), prod = info (esconde debug)
if (is.dev) {
  setLogLevel('debug')
} else {
  setLogLevel('info')
}

function createWindow(): void {
  logger.info('app', 'Criando janela principal')

  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      navigateOnDragDrop: false,
      // devTools: só habilitado em dev (em prod, usuário não precisa)
      devTools: is.dev
    } as Electron.WebPreferences
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Abre DevTools automaticamente em dev (modo "right" = painel lateral)
    // Isso facilita o debug durante o desenvolvimento
    if (is.dev) {
      mainWindow.webContents.openDevTools({ mode: 'right' })
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowed = is.dev
      ? [process.env['ELECTRON_RENDERER_URL'] || '']
      : ['file://']
    const isAllowed = allowed.some((prefix) => url.startsWith(prefix))
    if (!isAllowed) {
      event.preventDefault()
      logger.warn('security', `Navegação bloqueada: ${url}`)
    }
  })

  // Debug: captura crash do renderer process
  // Isso é crucial para diagnosticar problemas em produção
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    logger.error('renderer', 'Renderer process crashed', details)
  })

  // Debug: captura warnings e erros do console do renderer
  // level >= 2 significa warn(2) ou error(3)
  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    if (level >= 2) {
      logger.warn('renderer-console', `[${sourceId}:${line}] ${message}`)
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
  logger.info('ipc', 'Registrando handlers IPC')

  ipcMain.handle(IPC_CHANNELS.NOTES_GET_ALL, () => {
    logger.debug('ipc', 'notes:getAll chamado')
    return getAllNotes()
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, (_, title: unknown, content: unknown) => {
    logger.debug('ipc', 'notes:create chamado', { title })
    const validation = validateNoteInput(title, content)
    if (!validation.valid) {
      logger.warn('ipc', 'Validação falhou em notes:create', { error: validation.error })
      throw new Error(validation.error)
    }
    return createNote(sanitizeString(title as string), sanitizeString(content as string))
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, (_, id: unknown, title: unknown, content: unknown) => {
    logger.debug('ipc', 'notes:update chamado', { id })
    if (!validateId(id)) throw new Error('ID inválido')
    const validation = validateNoteInput(title, content)
    if (!validation.valid) throw new Error(validation.error)
    return updateNote(id as string, sanitizeString(title as string), sanitizeString(content as string))
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_DELETE, (_, id: unknown) => {
    logger.debug('ipc', 'notes:delete chamado', { id })
    if (!validateId(id)) throw new Error('ID inválido')
    return deleteNote(id as string)
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_EXPORT, async (_, title: string, content: string) => {
    logger.info('ipc', 'notes:export chamado', { title })
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
    logger.info('ipc', `Nota exportada para ${filePath}`)
    return true
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_IMPORT, async () => {
    logger.info('ipc', 'notes:import chamado')
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar Nota',
      filters: [{ name: 'Texto', extensions: ['txt', 'md'] }],
      properties: ['openFile']
    })
    if (canceled || filePaths.length === 0) return null
    const content = readFileSync(filePaths[0], 'utf-8')
    const fileName = filePaths[0].split(/[\\\/]/).pop() || 'Nota importada'
    const title = fileName.replace(/\.(txt|md)$/, '')
    logger.info('ipc', `Nota importada: ${title}`)
    return createNote(title, content)
  })

  ipcMain.handle(IPC_CHANNELS.APP_SHOW_NOTIFICATION, (_, title: string, body: string) => {
    new Notification({ title, body }).show()
    return true
  })
}

function configureSecurityHeaders(): void {
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

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowedPermissions = ['clipboard-read', 'clipboard-sanitized-write']
    callback(allowedPermissions.includes(permission))
  })
}

app.whenReady().then(() => {
  // Loga informações do ambiente (muito útil para diagnosticar problemas)
  logger.info('app', `App iniciado (${is.dev ? 'dev' : 'prod'})`)
  logger.info('app', `Electron ${process.versions.electron}, Node ${process.versions.node}`)

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
  logger.info('app', 'App encerrando')
  closeDatabase()
})

// Captura erros não tratados no main process.
// Sem isso, o app fecharia silenciosamente sem nenhum log.
// Com isso, o erro é gravado no arquivo de log para análise posterior.
process.on('uncaughtException', (error) => {
  logger.error('app', 'Erro não tratado', { message: error.message, stack: error.stack })
})

// Captura Promises rejeitadas sem .catch()
// Comum em código async/await onde esquecemos de tratar erros
process.on('unhandledRejection', (reason) => {
  logger.error('app', 'Promise rejeitada não tratada', { reason })
})
