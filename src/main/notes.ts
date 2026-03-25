// ============================================================
// src/main/notes.ts — CRUD com SQL
//
// MUDANÇA NESTA LIÇÃO:
// ANTES: array em memória (perdia tudo ao fechar)
// AGORA: queries SQL com better-sqlite3 (dados persistem)
//
// A interface (assinatura das funções) não mudou!
// O preload e o renderer não sabem que agora é SQLite.
// Essa é a vantagem de ter o preload como contrato.
// ============================================================

import { Note } from '../shared/types'
import { getDatabase } from './database'
import { randomUUID } from 'crypto'

// Converte uma row do SQLite (snake_case) para o tipo Note (camelCase)
function rowToNote(row: Record<string, string>): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function getAllNotes(): Note[] {
  const db = getDatabase()
  // Ordena por data de atualização (mais recente primeiro)
  const rows = db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all() as Record<string, string>[]
  return rows.map(rowToNote)
}

export function createNote(title: string, content: string): Note {
  const db = getDatabase()
  const id = randomUUID()
  const now = new Date().toISOString()

  // Prepared statement com '?' previne SQL injection
  db.prepare(
    'INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, title, content, now, now)

  return { id, title, content, createdAt: now, updatedAt: now }
}

export function updateNote(id: string, title: string, content: string): Note | null {
  const db = getDatabase()
  const now = new Date().toISOString()

  // result.changes indica quantas rows foram afetadas
  const result = db
    .prepare('UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?')
    .run(title, content, now, id)

  // Se nenhuma row foi afetada, o ID não existe
  if (result.changes === 0) return null

  return { id, title, content, createdAt: '', updatedAt: now }
}

export function deleteNote(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(id)
  return result.changes > 0
}
