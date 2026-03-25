/**
 * index.ts — Main Process (Lição 08 — Segurança)
 *
 * Nesta lição adicionamos várias camadas de segurança:
 *
 * 1. VALIDAÇÃO DE INPUT: todos os dados IPC são validados antes de usar
 * 2. SANITIZAÇÃO: caracteres de controle são removidos
 * 3. WEBPREFERENCES SEGURAS: nodeIntegration=false, contextIsolation=true
 * 4. NAVEGAÇÃO BLOQUEADA: impede redirecionamentos maliciosos
 * 5. HEADERS DE SEGURANÇA: X-Content-Type-Options, X-Frame-Options, etc.
 * 6. PERMISSÕES RESTRITAS: bloqueia câmera, microfone, geolocalização, etc.
 *
 * Por que isso importa?
 * Apps Electron têm acesso total ao sistema (Node.js + Chromium). Se o renderer
 * for comprometido (ex.: XSS), um atacante poderia executar código no sistema.
 * Essas proteções minimizam a superfície de ataque.
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
      // ── Configurações de Segurança ──
      // nodeIntegration: false → o renderer NÃO pode usar require() ou APIs Node.js
      // (só pode acessar o que o preload expõe via contextBridge)
      nodeIntegration: false,
      // contextIsolation: true → o preload roda em contexto separado do renderer
      // (impede que scripts maliciosos modifiquem a API exposta)
      contextIsolation: true,
      // enableRemoteModule: false → desabilita o módulo @electron/remote
      // (evita que o renderer acesse APIs do main process diretamente)
      enableRemoteModule: false,
      // navigateOnDragDrop: false → impede que arrastar um arquivo para a janela
      // cause navegação (o que exporia o conteúdo do arquivo)
      navigateOnDragDrop: false
    } as Electron.WebPreferences
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Segurança: abre links externos no navegador padrão (nunca dentro do Electron)
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Segurança: bloqueia navegação para URLs não permitidas
  // Sem isso, um link malicioso poderia redirecionar a janela para um site externo
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

/**
 * IPC Handlers com validação.
 *
 * Mudanças em relação à lição anterior:
 * - Parâmetros tipados como `unknown` (não confiamos no renderer)
 * - validateNoteInput() verifica tipo e tamanho
 * - validateId() verifica formato do ID
 * - sanitizeString() remove caracteres de controle
 */
function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.NOTES_GET_ALL, () => getAllNotes())

  // CREATE: valida + sanitiza antes de criar
  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, (_, title: unknown, content: unknown) => {
    const validation = validateNoteInput(title, content)
    if (!validation.valid) throw new Error(validation.error)
    return createNote(sanitizeString(title as string), sanitizeString(content as string))
  })

  // UPDATE: valida ID + valida input + sanitiza
  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, (_, id: unknown, title: unknown, content: unknown) => {
    if (!validateId(id)) throw new Error('ID inválido')
    const validation = validateNoteInput(title, content)
    if (!validation.valid) throw new Error(validation.error)
    return updateNote(id as string, sanitizeString(title as string), sanitizeString(content as string))
  })

  // DELETE: valida formato do ID
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
    const fileName = filePaths[0].split(/[\\\/]/).pop() || 'Nota importada'
    const title = fileName.replace(/\.(txt|md)$/, '')
    return createNote(title, content)
  })

  // Notificação nativa
  ipcMain.handle(IPC_CHANNELS.APP_SHOW_NOTIFICATION, (_, title: string, body: string) => {
    new Notification({ title, body }).show()
    return true
  })
}

/**
 * Configura headers de segurança HTTP e restringe permissões.
 *
 * Headers:
 * - X-Content-Type-Options: nosniff → previne MIME type sniffing
 * - X-Frame-Options: DENY → impede que o app seja embutido em iframe
 * - X-XSS-Protection: 1 → ativa filtro XSS do navegador
 *
 * Permissões:
 * - Bloqueia câmera, microfone, geolocalização, etc.
 * - Permite apenas clipboard (copiar/colar)
 */
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

  // Bloqueia permissões desnecessarias (câmera, mic, localização, etc.)
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

  // Ordem: segurança → handlers → janela
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
