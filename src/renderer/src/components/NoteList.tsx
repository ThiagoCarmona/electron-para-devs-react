import { Note } from '../types'

interface NoteListProps {
  notes: Note[]
  selectedId: string | null
  onSelect: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteList({ notes, selectedId, onSelect, onDelete }: NoteListProps): JSX.Element {
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
          key={note.id}
          className={`note-item ${selectedId === note.id ? 'selected' : ''}`}
          onClick={() => onSelect(note)}
        >
          <div className="note-item-content">
            <strong className="note-item-title">{note.title || 'Sem título'}</strong>
            <span className="note-item-preview">
              {note.content.slice(0, 60) || 'Nota vazia'}
            </span>
          </div>
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
