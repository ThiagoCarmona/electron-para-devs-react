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
