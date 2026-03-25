/**
 * preload/index.ts — Ponte entre Main e Renderer (Context Bridge)
 *
 * Nesta lição, além das operações CRUD, expomos ao renderer:
 * - exportNote / importNote: acionam diálogos nativos via IPC
 * - showNotification: mostra notificações do sistema via IPC
 * - onMenuNewNote / onMenuExportNote / onMenuImportNote: escutam eventos IPC
 *   que vêm do main process (direção main → renderer)
 *
 * Cada função on*() RETORNA uma função de cleanup que remove o listener.
 * Isso é essencial para evitar vazamento de listeners no React.
 */

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS } from '../shared/types'
import type { Note } from '../shared/types'

const api = {
  // ── CRUD de notas (invoke/handle — renderer → main) ──
  getNotes: (): Promise<Note[]> => ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET_ALL),
  createNote: (title: string, content: string): Promise<Note> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_CREATE, title, content),
  updateNote: (id: string, title: string, content: string): Promise<Note | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_UPDATE, id, title, content),
  deleteNote: (id: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_DELETE, id),

  // ── Arquivo: exportar/importar via diálogos nativos ──
  exportNote: (title: string, content: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_EXPORT, title, content),
  importNote: (): Promise<Note | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_IMPORT),

  // ── Notificação nativa ──
  showNotification: (title: string, body: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.APP_SHOW_NOTIFICATION, title, body),

  // ── Escuta eventos do menu nativo (main → renderer) ──
  // Cada função retorna uma cleanup function para remover o listener
  onMenuNewNote: (callback: () => void): (() => void) => {
    ipcRenderer.on('menu:newNote', callback)
    return (): void => {
      ipcRenderer.removeListener('menu:newNote', callback)
    }
  },
  onMenuExportNote: (callback: () => void): (() => void) => {
    ipcRenderer.on('menu:exportNote', callback)
    return (): void => {
      ipcRenderer.removeListener('menu:exportNote', callback)
    }
  },
  onMenuImportNote: (callback: () => void): (() => void) => {
    ipcRenderer.on('menu:importNote', callback)
    return (): void => {
      ipcRenderer.removeListener('menu:importNote', callback)
    }
  },

  // ── Utilitários ──
  getVersions: (): { electron: string; chrome: string; node: string } => ({
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  }),
  getPlatform: (): string => process.platform
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
