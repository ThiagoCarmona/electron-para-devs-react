import { useState, useEffect, useCallback } from 'react'
import { NoteList } from './components/NoteList'
import { NoteEditor } from './components/NoteEditor'
import { Note } from './types'
import './styles/global.css'

function App(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

  const loadNotes = useCallback(async (): Promise<void> => {
    const data = await window.api.getNotes()
    setNotes(data)
    return
  }, [])

  // Carrega as notas ao iniciar
  useEffect(() => {
    loadNotes().then(() => setLoading(false))
  }, [loadNotes])

  const handleCreateNote = useCallback(async (): Promise<void> => {
    const newNote = await window.api.createNote('Nova nota', '')
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote)
  }, [])

  const handleImportNote = useCallback(async (): Promise<void> => {
    const imported = await window.api.importNote()
    if (imported) {
      setNotes((prev) => [imported, ...prev])
      setSelectedNote(imported)
      await window.api.showNotification('Nota importada', `"${imported.title}" foi importada.`)
    }
  }, [])

  const handleExportNote = useCallback(async (): Promise<void> => {
    if (!selectedNote) return
    const success = await window.api.exportNote(selectedNote.title, selectedNote.content)
    if (success) {
      await window.api.showNotification('Nota exportada', `"${selectedNote.title}" foi salva.`)
    }
  }, [selectedNote])

  // Escuta eventos do menu nativo
  useEffect(() => {
    window.api.onMenuNewNote(() => handleCreateNote())
    window.api.onMenuExportNote(() => handleExportNote())
    window.api.onMenuImportNote(() => handleImportNote())
  }, [handleCreateNote, handleExportNote, handleImportNote])

  const handleSelectNote = (note: Note): void => {
    setSelectedNote(note)
  }

  const handleUpdateNote = async (id: string, title: string, content: string): Promise<void> => {
    const updated = await window.api.updateNote(id, title, content)
    if (!updated) return
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
    if (selectedNote?.id === id) setSelectedNote(updated)
  }

  const handleDeleteNote = async (id: string): Promise<void> => {
    const success = await window.api.deleteNote(id)
    if (!success) return
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selectedNote?.id === id) setSelectedNote(null)
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
          <button className="btn-new" onClick={handleCreateNote}>+ Nova</button>
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
