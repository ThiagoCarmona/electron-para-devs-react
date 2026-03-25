/**
 * useNoteStore.ts — Gerenciamento de estado com Zustand
 *
 * Na lição anterior, todo o estado ficava no App.tsx com useState/useCallback.
 * Isso funciona, mas à medida que o app cresce, o componente fica inchado.
 *
 * Zustand é uma biblioteca leve de gerenciamento de estado para React.
 * Vantagens sobre useState espalhado:
 * - Estado centralizado: todas as notas e ações ficam num só lugar
 * - Sem prop drilling: qualquer componente pode acessar a store diretamente
 * - Funções estáveis: as ações não mudam de referência a cada render
 * - Simples: não precisa de Context, Provider, ou boilerplate
 *
 * Conceitos-chave do Zustand:
 * - `create<T>()`: cria a store com tipagem TypeScript
 * - `set()`: atualiza o estado (aceita um objeto parcial ou uma função)
 * - `get()`: lê o estado atual (usado dentro de ações assíncronas)
 * - `set((state) => ({...}))`: atualiza baseado no estado anterior (como setState do React)
 */

import { create } from 'zustand'
import { Note } from '../types'

/**
 * Interface da store: define tanto o ESTADO (dados) quanto as AÇÕES (funções).
 * No Zustand, estado e ações vivem juntos no mesmo objeto.
 */
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

/**
 * create<NoteStore>() recebe uma função que retorna o estado inicial + ações.
 * Os parâmetros (set, get) são fornecidos pelo Zustand:
 * - set: atualiza o estado e re-renderiza os componentes que usam a store
 * - get: lê o estado atual sem causar re-render
 */
export const useNoteStore = create<NoteStore>((set, get) => ({
  // ── Estado inicial ──
  notes: [],
  selectedNote: null,
  loading: true,

  // ── Ações ──

  // Carrega todas as notas do banco de dados via IPC
  loadNotes: async (): Promise<void> => {
    const notes = await window.api.getNotes()
    // set() com objeto: substitui apenas as propriedades especificadas
    set({ notes, loading: false })
  },

  // Seleciona uma nota (ou null para deselecionar)
  selectNote: (note): void => {
    set({ selectedNote: note })
  },

  // Cria uma nota e a adiciona no início da lista
  createNote: async (): Promise<void> => {
    const newNote = await window.api.createNote('Nova nota', '')
    // set() com função: recebe o estado anterior (como setState do React)
    // Isso é necessário quando o novo estado depende do anterior
    set((state) => ({
      notes: [newNote, ...state.notes],
      selectedNote: newNote
    }))
  },

  // Atualiza título e conteúdo de uma nota existente
  updateNote: async (id, title, content): Promise<void> => {
    const updated = await window.api.updateNote(id, title, content)
    if (!updated) return

    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? updated : n)),
      // Se a nota atualizada é a selecionada, atualiza ela também
      selectedNote: state.selectedNote?.id === id ? updated : state.selectedNote
    }))
  },

  // Remove uma nota pelo ID
  deleteNote: async (id): Promise<void> => {
    const success = await window.api.deleteNote(id)
    if (!success) return

    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      // Se a nota deletada era a selecionada, limpa a seleção
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote
    }))
  },

  // Importa uma nota de arquivo .txt/.md via diálogo nativo
  importNote: async (): Promise<void> => {
    const imported = await window.api.importNote()
    if (!imported) return

    set((state) => ({
      notes: [imported, ...state.notes],
      selectedNote: imported
    }))
    // Mostra notificação nativa do sistema
    await window.api.showNotification('Nota importada', `"${imported.title}" foi importada.`)
  },

  // Exporta a nota selecionada como arquivo
  exportNote: async (): Promise<void> => {
    // get() lê o estado atual — útil em ações assíncronas onde
    // o estado pode ter mudado desde o início da função
    const { selectedNote } = get()
    if (!selectedNote) return

    const success = await window.api.exportNote(selectedNote.title, selectedNote.content)
    if (success) {
      await window.api.showNotification('Nota exportada', `"${selectedNote.title}" foi salva.`)
    }
  }
}))
