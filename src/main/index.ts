// ============================================================
// src/main/index.ts — Main process com handlers IPC
//
// MUDANÇA NESTA LIÇÃO:
// - Importa funções de CRUD de ./notes
// - Registra 4 handlers IPC (como endpoints de API)
// - O renderer agora pede dados via IPC em vez de ter estado local
// ============================================================

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { IPC_CHANNELS } from '../shared/types'
import { getAllNotes, createNote, updateNote, deleteNote } from './notes'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
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
}

/**
 * Registra os handlers IPC — pense neles como rotas de uma API REST:
 *
 * GET  /notes       →  notes:getAll
 * POST /notes       →  notes:create
 * PUT  /notes/:id   →  notes:update
 * DELETE /notes/:id →  notes:delete
 *
 * O primeiro parâmetro '_' é o evento IPC (ignoramos aqui).
 * Os demais são os argumentos enviados pelo renderer.
 */
function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.NOTES_GET_ALL, () => {
    return getAllNotes()
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, (_, title: string, content: string) => {
    return createNote(title, content)
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, (_, id: string, title: string, content: string) => {
    return updateNote(id, title, content)
  })

  ipcMain.handle(IPC_CHANNELS.NOTES_DELETE, (_, id: string) => {
    return deleteNote(id)
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Registra handlers ANTES de criar a janela
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
