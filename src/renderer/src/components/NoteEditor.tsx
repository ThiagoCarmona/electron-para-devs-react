import { useState, useEffect } from 'react'
import { Note } from '../types'

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, title: string, content: string) => void
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps): JSX.Element {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  // Sincroniza quando a nota selecionada muda
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note.id])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle = e.target.value
    setTitle(newTitle)
    onUpdate(note.id, newTitle, content)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newContent = e.target.value
    setContent(newContent)
    onUpdate(note.id, title, newContent)
  }

  const formatDate = (iso: string): string => {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="editor">
      <input
        className="editor-title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Título da nota"
      />
      <span className="editor-date">Editado em {formatDate(note.updatedAt)}</span>
      <textarea
        className="editor-content"
        value={content}
        onChange={handleContentChange}
        placeholder="Comece a escrever..."
      />
    </div>
  )
}
