import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS } from '../shared/types'
import type { Note } from '../shared/types'

const api = {
  // CRUD de notas via IPC
  getNotes: (): Promise<Note[]> => ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET_ALL),

  createNote: (title: string, content: string): Promise<Note> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_CREATE, title, content),

  updateNote: (id: string, title: string, content: string): Promise<Note | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_UPDATE, id, title, content),

  deleteNote: (id: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_DELETE, id),

  // Utilitários
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
