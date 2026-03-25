// ============================================================
// Tipos do preload — diz ao TypeScript o que existe em window.api
//
// Sem este arquivo, o TypeScript não saberia que window.electron
// e window.api existem, e mostraria erros no editor.
// ============================================================

import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
