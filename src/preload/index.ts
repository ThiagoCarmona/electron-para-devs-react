// ============================================================
// src/preload/index.ts — A ponte entre main e renderer
//
// Este script roda ANTES do React carregar na janela.
// Ele tem acesso tanto ao Node.js quanto ao contexto do navegador.
//
// Sua função é escolher O QUE o React pode acessar.
// Pense nele como um cardápio: o React só pode pedir
// o que está listado aqui.
// ============================================================

import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// O objeto 'api' é o que o React vai enxergar em window.api
// Por enquanto está vazio — nas próximas lições vamos adicionar funções aqui
const api = {}

// contextIsolated = true (o padrão seguro)
// Significa que o código do preload é ISOLADO do código do renderer.
// O único jeito de passar dados é via contextBridge.
if (process.contextIsolated) {
  try {
    // Expõe a API do electron-toolkit como window.electron
    contextBridge.exposeInMainWorld('electron', electronAPI)

    // Expõe nosso objeto customizado como window.api
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback menos seguro (usado raramente)
  window.electron = electronAPI
  window.api = api
}
