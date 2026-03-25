// ============================================================
// src/main/notes.ts — Lógica de dados das notas
//
// NOVO NESTA LIÇÃO!
// Este é o "backend" das notas. Por enquanto usa um array
// em memória (se fechar o app, perde tudo).
// Na lição 05 vamos trocar por SQLite — mesma interface.
// ============================================================

import { Note } from '../shared/types'
import { randomUUID } from 'crypto'

// Armazenamento em memória (temporário)
let notes: Note[] = [
  {
    id: randomUUID(),
    title: 'Bem-vindo ao Electron Notas',
    content:
      'Este é o seu app de notas desktop.\n\nAs notas agora vivem no main process e são acessadas via IPC.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Retorna todas as notas, ordenadas por data (mais recente primeiro)
export function getAllNotes(): Note[] {
  return [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

// Cria uma nova nota com UUID gerado pelo Node.js
export function createNote(title: string, content: string): Note {
  const note: Note = {
    id: randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  notes.push(note)
  return note
}

// Atualiza título e conteúdo de uma nota existente
// Retorna null se o ID não for encontrado
export function updateNote(id: string, title: string, content: string): Note | null {
  const index = notes.findIndex((n) => n.id === id)
  if (index === -1) return null

  notes[index] = {
    ...notes[index],
    title,
    content,
    updatedAt: new Date().toISOString()
  }
  return notes[index]
}

// Remove uma nota. Retorna true se encontrou e removeu.
export function deleteNote(id: string): boolean {
  const index = notes.findIndex((n) => n.id === id)
  if (index === -1) return false

  notes.splice(index, 1)
  return true
}
