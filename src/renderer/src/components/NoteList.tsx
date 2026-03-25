// ============================================================
// NoteList.tsx — Lista de notas na sidebar
//
// Recebe as notas e callbacks do App (pai).
// Não tem estado próprio — só renderiza o que recebe.
// ============================================================

import { Note } from '../types'

interface NoteListProps {
  notes: Note[]
  selectedId: string | null     // ID da nota selecionada (para destacar)
  onSelect: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteList({ notes, selectedId, onSelect, onDelete }: NoteListProps): JSX.Element {
  // Lista vazia: mostra mensagem
  if (notes.length === 0) {
    return (
      <div className="note-list-empty">
        <p>Nenhuma nota ainda</p>
      </div>
    )
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li
          key={note.id} // key = ID único para reconciliação do React
          className={`note-item ${selectedId === note.id ? 'selected' : ''}`}
          onClick={() => onSelect(note)}
        >
          <div className="note-item-content">
            <strong className="note-item-title">{note.title || 'Sem título'}</strong>
            <span className="note-item-preview">
              {note.content.slice(0, 60) || 'Nota vazia'}
            </span>
          </div>

          {/* Botão de excluir: stopPropagation evita que o clique
              também selecione a nota (event bubbling) */}
          <button
            className="btn-delete"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(note.id)
            }}
            title="Excluir nota"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
