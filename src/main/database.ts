import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

let db: Database.Database

export function getDatabase(): Database.Database {
  if (db) return db

  // Caminho do banco: pasta de dados do app do usuário
  const userDataPath = app.getPath('userData')
  const dbDir = join(userDataPath, 'data')

  // Cria o diretório se não existir
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  const dbPath = join(dbDir, 'notes.db')
  console.log('Database path:', dbPath)

  db = new Database(dbPath)

  // Ativa WAL mode para melhor performance
  db.pragma('journal_mode = WAL')

  // Cria a tabela se não existir
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  return db
}

export function closeDatabase(): void {
  if (db) {
    db.close()
  }
}
