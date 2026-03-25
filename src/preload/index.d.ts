import { ElectronAPI } from '@electron-toolkit/preload'
import type { Note } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getNotes: () => Promise<Note[]>
      createNote: (title: string, content: string) => Promise<Note>
      updateNote: (id: string, title: string, content: string) => Promise<Note | null>
      deleteNote: (id: string) => Promise<boolean>
      exportNote: (title: string, content: string) => Promise<boolean>
      importNote: () => Promise<Note | null>
      showNotification: (title: string, body: string) => Promise<boolean>
      onMenuNewNote: (callback: () => void) => void
      onMenuExportNote: (callback: () => void) => void
      onMenuImportNote: (callback: () => void) => void
      getVersions: () => { electron: string; chrome: string; node: string }
      getPlatform: () => string
    }
  }
}
