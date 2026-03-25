// ============================================================
// types.ts — Interface que define o formato de uma nota
//
// Usa string para datas (ISO 8601) porque JSON não tem tipo Date.
// Exemplo de data: "2026-03-25T14:30:00.000Z"
// ============================================================

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
}
