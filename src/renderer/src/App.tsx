// ============================================================
// App.tsx — Agora busca dados do main process via IPC
//
// MUDANÇA NESTA LIÇÃO:
// - Não tem mais sampleNotes hardcoded
// - Todas as operações são async/await (IPC retorna Promises)
// - useEffect carrega as notas do main process ao iniciar
// - Estado 'loading' mostra feedback enquanto carrega
// ============================================================

import { useState, useEffect } from 'react'
import { NoteList } from './components/NoteList'
import { NoteEditor } from './components/NoteEditor'
import { Note } from './types'
import './styles/global.css'

function App(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

  // Carrega as notas do main process ao montar o componente
  useEffect(() => {
    window.api.getNotes().then((data) => {
      setNotes(data)
      if (data.length > 0) setSelectedNote(data[0])
      setLoading(false)
    })
  }, [])

  const handleSelectNote = (note: Note): void => {
    setSelectedNote(note)
  }

  // ANTES: síncrono (setNotes direto)
  // AGORA: assíncrono (espera o main process atualizar, depois atualiza o estado)
  const handleUpdateNote = async (id: string, title: string, content: string): Promise<void> => {
    const updated = await window.api.updateNote(id, title, content)
    if (!updated) return

    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
    if (selectedNote?.id === id) {
      setSelectedNote(updated)
    }
  }

  const handleCreateNote = async (): Promise<void> => {
    const newNote = await window.api.createNote('Nova nota', '')
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote)
  }

  const handleDeleteNote = async (id: string): Promise<void> => {
    const success = await window.api.deleteNote(id)
    if (!success) return

    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

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
          <button className="btn-new" onClick={handleCreateNote}>
            + Nova
          </button>
        </div>
        <NoteList
          notes={notes}
          selectedId={selectedNote?.id || null}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
        />
      </aside>
      <main className="editor-area">
        {selectedNote ? (
          <NoteEditor note={selectedNote} onUpdate={handleUpdateNote} />
        ) : (
          <div className="empty-state">
            <p>Selecione uma nota ou crie uma nova</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
