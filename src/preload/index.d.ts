// ============================================================
// Tipos atualizados — agora window.api tem 3 funções
//
// IMPORTANTE: sempre atualize este arquivo quando mudar o preload.
// Sem isso, o TypeScript no React não sabe que as funções existem.
// ============================================================

import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getVersions: () => { electron: string; chrome: string; node: string }
      ping: () => Promise<string>
      getPlatform: () => string
    }
  }
}
