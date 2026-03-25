import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// API customizada que o renderer pode acessar
const api = {
  // Retorna as versões do Electron, Chrome e Node
  getVersions: (): { electron: string; chrome: string; node: string } => {
    return {
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node
    }
  },

  // Exemplo de IPC: envia ping e recebe pong
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),

  // Retorna a plataforma do sistema operacional
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
