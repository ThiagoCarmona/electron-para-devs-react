// ============================================================
// App.tsx — Componente raiz com layout sidebar + editor
//
// ANTES (lição 02): mostrava versões e botão de ping.
// AGORA: interface completa do app de notas.
//
// O estado das notas vive AQUI (lifting state up).
// Os filhos (NoteList, NoteEditor) recebem dados e callbacks via props.
//
// NOTA: as notas são hardcoded em memória. Se recarregar, perde tudo.
// Na lição 04 vamos mover para o main process via IPC.
// ============================================================

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
  // Estado principal: lista de notas e qual está selecionada
  const [notes, setNotes] = useState<Note[]>(sampleNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(sampleNotes[0])

  // Callback: seleciona uma nota ao clicar na lista
  const handleSelectNote = (note: Note): void => {
    setSelectedNote(note)
  }

  // Callback: atualiza título/conteúdo de uma nota existente
  const handleUpdateNote = (id: string, title: string, content: string): void => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
      )
    )
    // Atualiza também a nota selecionada (para o editor refletir a mudança)
    if (selectedNote?.id === id) {
      setSelectedNote((prev) =>
        prev ? { ...prev, title, content, updatedAt: new Date().toISOString() } : null
      )
    }
  }

  // Callback: cria uma nova nota com valores padrão
  const handleCreateNote = (): void => {
    const newNote: Note = {
      id: Date.now().toString(), // ID simples (na lição 04 usamos UUID)
      title: 'Nova nota',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes((prev) => [newNote, ...prev]) // Adiciona no início
    setSelectedNote(newNote)                // Seleciona automaticamente
  }

  // Callback: remove uma nota da lista
  const handleDeleteNote = (id: string): void => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    // Se a nota deletada era a selecionada, limpa a seleção
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

  return (
    <div className="app">
      {/* Sidebar: lista de notas + botão de criar */}
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

      {/* Área principal: editor ou mensagem de estado vazio */}
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
