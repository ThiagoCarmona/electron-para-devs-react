// ============================================================
// NoteEditor.tsx — Editor de nota (título + conteúdo)
//
// Usa estado LOCAL (useState) para título e conteúdo.
// Por que? Para que a digitação seja instantânea.
// Se dependesse só do estado do App, cada tecla causaria
// re-render da árvore inteira.
//
// O useEffect sincroniza quando o usuário TROCA de nota
// (usa note.id, não o objeto inteiro, para não resetar a cada digitação).
// ============================================================

import { useState, useEffect } from 'react'
import { Note } from '../types'

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, title: string, content: string) => void
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps): JSX.Element {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  // Sincroniza o estado local quando o usuário troca de nota.
  // Dependência: note.id (não note!) — só reseta ao trocar de nota.
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note.id])

  // A cada digitação: atualiza estado local + notifica o App pai
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

  // Formata data ISO para formato legível em pt-BR
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
      {/* Input controlado para o título */}
      <input
        className="editor-title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Título da nota"
      />
      <span className="editor-date">Editado em {formatDate(note.updatedAt)}</span>

      {/* Textarea controlado para o conteúdo */}
      <textarea
        className="editor-content"
        value={content}
        onChange={handleContentChange}
        placeholder="Comece a escrever..."
      />
    </div>
  )
}
