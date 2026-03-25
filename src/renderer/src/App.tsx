/**
 * App.tsx — Componente raiz (Lição 07)
 *
 * Compare este arquivo com o App.tsx da lição 06:
 * - Antes: ~100 linhas com useState, useCallback, lógica de CRUD inline
 * - Agora: ~60 linhas — toda a lógica migrou para useNoteStore
 *
 * O componente agora é praticamente só UI + efeitos.
 * Toda lógica de estado e ações vive na store Zustand.
 *
 * Benefícios:
 * - App.tsx fica mais fácil de ler e manter
 * - Qualquer outro componente pode acessar a store sem prop drilling
 * - As funções da store têm referência estável (não mudam a cada render)
 */

import { useEffect } from 'react'
import { NoteList } from './components/NoteList'
import { NoteEditor } from './components/NoteEditor'
import { useNoteStore } from './store/useNoteStore'
import './styles/global.css'

function App(): JSX.Element {
  // Desestruturação da store — todas as ações e estado vem do Zustand
  const {
    notes,
    selectedNote,
    loading,
    loadNotes,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    importNote,
    exportNote
  } = useNoteStore()

  // Carrega notas ao iniciar
  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  // Escuta eventos do menu nativo (IPC main → renderer)
  // As funções onMenu*() retornam cleanup functions para evitar listeners duplicados
  useEffect(() => {
    const cleanupNew = window.api.onMenuNewNote(() => createNote())
    const cleanupExport = window.api.onMenuExportNote(() => exportNote())
    const cleanupImport = window.api.onMenuImportNote(() => importNote())

    return (): void => {
      cleanupNew()
      cleanupExport()
      cleanupImport()
    }
  }, [createNote, exportNote, importNote])

  if (loading) {
    return (
      <div className="app">
        <div className="empty-state">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Notas</h1>
          <button className="btn-new" onClick={createNote}>+ Nova</button>
        </div>
        <NoteList
          notes={notes}
          selectedId={selectedNote?.id || null}
          onSelect={selectNote}
          onDelete={deleteNote}
        />
      </aside>
      <main className="editor-area">
        {selectedNote ? (
          <NoteEditor note={selectedNote} onUpdate={updateNote} />
        ) : (
          <div className="empty-state">
            <p>Selecione uma nota ou crie uma nova</p>
          </div>
        )}
      </main>
    </div>
  )
}

// DESAFIO: Extraia o contador de notas da store e exiba "X notas" no header.
// Dica: você pode criar um seletor derivado com useNoteStore((s) => s.notes.length)

export default App
