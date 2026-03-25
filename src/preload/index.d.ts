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
      getVersions: () => { electron: string; chrome: string; node: string }
      getPlatform: () => string
    }
  }
}
