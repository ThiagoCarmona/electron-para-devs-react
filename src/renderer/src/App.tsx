import { useEffect } from 'react'
import { NoteList } from './components/NoteList'
import { NoteEditor } from './components/NoteEditor'
import { useNoteStore } from './store/useNoteStore'
import './styles/global.css'

function App(): JSX.Element {
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

  // Escuta eventos do menu nativo
  useEffect(() => {
    window.api.onMenuNewNote(() => createNote())
    window.api.onMenuExportNote(() => exportNote())
    window.api.onMenuImportNote(() => importNote())
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

export default App
