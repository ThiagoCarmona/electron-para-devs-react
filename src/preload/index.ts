// ============================================================
// src/preload/index.ts — A ponte entre main e renderer
//
// ANTES (lição 01): o objeto 'api' estava vazio.
// AGORA: adicionamos 3 funções que o React pode chamar.
//
// Tudo que colocarmos no objeto 'api' fica acessível no
// React como window.api.nomeDaFuncao()
// ============================================================

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Função 1: retorna as versões do Electron, Chrome e Node.
  // O 'process' é uma API do Node.js — só acessível aqui no preload,
  // não no renderer. Por isso precisamos expor via contextBridge.
  getVersions: (): { electron: string; chrome: string; node: string } => {
    return {
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node
    }
  },

  // Função 2: envia 'ping' ao main process e espera resposta.
  // ipcRenderer.invoke() retorna uma Promise — é como fazer
  // um fetch() para o main process.
  // No main, usamos ipcMain.handle('ping', ...) para responder.
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),

  // Função 3: retorna o sistema operacional.
  // 'win32' = Windows, 'darwin' = macOS, 'linux' = Linux
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
