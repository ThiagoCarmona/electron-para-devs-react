import { useState } from 'react'
import { NoteList } from './components/NoteList'
import { NoteEditor } from './components/NoteEditor'
import { Note } from './types'
import './styles/global.css'

// Notas de exemplo (temporárias — na lição 04 vem do main process)
const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Bem-vindo ao Electron Notas',
    content: 'Este é o seu app de notas desktop. Nas próximas lições, vamos adicionar persistência e mais funcionalidades.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Dica: atalhos',
    content: 'Use Ctrl+N para criar uma nova nota (em breve!).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

function App(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>(sampleNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(sampleNotes[0])

  const handleSelectNote = (note: Note): void => {
    setSelectedNote(note)
  }

  const handleUpdateNote = (id: string, title: string, content: string): void => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
      )
    )
    if (selectedNote?.id === id) {
      setSelectedNote((prev) =>
        prev ? { ...prev, title, content, updatedAt: new Date().toISOString() } : null
      )
    }
  }

  const handleCreateNote = (): void => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nova nota',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote)
  }

  const handleDeleteNote = (id: string): void => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
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
