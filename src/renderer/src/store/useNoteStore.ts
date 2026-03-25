import { create } from 'zustand'
import { Note } from '../types'

interface NoteStore {
  // Estado
  notes: Note[]
  selectedNote: Note | null
  loading: boolean

  // Ações
  loadNotes: () => Promise<void>
  selectNote: (note: Note | null) => void
  createNote: () => Promise<void>
  updateNote: (id: string, title: string, content: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  importNote: () => Promise<void>
  exportNote: () => Promise<void>
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  selectedNote: null,
  loading: true,

  loadNotes: async (): Promise<void> => {
    const notes = await window.api.getNotes()
    set({ notes, loading: false })
  },

  selectNote: (note): void => {
    set({ selectedNote: note })
  },

  createNote: async (): Promise<void> => {
    const newNote = await window.api.createNote('Nova nota', '')
    set((state) => ({
      notes: [newNote, ...state.notes],
      selectedNote: newNote
    }))
  },

  updateNote: async (id, title, content): Promise<void> => {
    const updated = await window.api.updateNote(id, title, content)
    if (!updated) return

    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? updated : n)),
      selectedNote: state.selectedNote?.id === id ? updated : state.selectedNote
    }))
  },

  deleteNote: async (id): Promise<void> => {
    const success = await window.api.deleteNote(id)
    if (!success) return

    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote
    }))
  },

  importNote: async (): Promise<void> => {
    const imported = await window.api.importNote()
    if (!imported) return

    set((state) => ({
      notes: [imported, ...state.notes],
      selectedNote: imported
    }))
    await window.api.showNotification('Nota importada', `"${imported.title}" foi importada.`)
  },

  exportNote: async (): Promise<void> => {
    const { selectedNote } = get()
    if (!selectedNote) return

    const success = await window.api.exportNote(selectedNote.title, selectedNote.content)
    if (success) {
      await window.api.showNotification('Nota exportada', `"${selectedNote.title}" foi salva.`)
    }
  }
}))
