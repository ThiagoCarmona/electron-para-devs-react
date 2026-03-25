// ============================================================
// src/main/database.ts — Configuração do SQLite
//
// NOVO NESTA LIÇÃO!
// Cria e configura o banco de dados SQLite usando better-sqlite3.
//
// O banco fica em:
// - Windows: %APPDATA%/electron-notas/data/notes.db
// - macOS:   ~/Library/Application Support/electron-notas/data/notes.db
// - Linux:   ~/.config/electron-notas/data/notes.db
// ============================================================

import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// Singleton: só cria o banco uma vez
let db: Database.Database

export function getDatabase(): Database.Database {
  // Se já existe, retorna o mesmo (padrão singleton)
  if (db) return db

  // app.getPath('userData') retorna a pasta de dados específica
  // do app para cada sistema operacional
  const userDataPath = app.getPath('userData')
  const dbDir = join(userDataPath, 'data')

  // Cria o diretório se não existir
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  const dbPath = join(dbDir, 'notes.db')
  console.log('Database path:', dbPath)

  // Cria (ou abre) o banco de dados
  db = new Database(dbPath)

  // WAL (Write-Ahead Logging): permite leituras e escritas simultâneas.
  // Sem WAL, uma escrita bloqueia todas as leituras.
  db.pragma('journal_mode = WAL')

  // Cria a tabela se não existir (só roda na primeira vez)
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

// Fecha a conexão com o banco (chamado quando o app encerra)
export function closeDatabase(): void {
  if (db) {
    db.close()
  }
}
