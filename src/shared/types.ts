// ============================================================
// src/shared/types.ts — Código compartilhado entre processos
//
// NOVO NESTA LIÇÃO!
// Esta pasta 'shared/' contém código que o main, o preload
// e o renderer usam. Evita duplicar interfaces e garante
// que os canais IPC sejam consistentes.
// ============================================================

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
}

// Constantes para os canais IPC.
// Usar constantes evita erros de digitação: se você errar o nome,
// o TypeScript avisa. Strings soltas não avisam.
export const IPC_CHANNELS = {
  NOTES_GET_ALL: 'notes:getAll',
  NOTES_CREATE: 'notes:create',
  NOTES_UPDATE: 'notes:update',
  NOTES_DELETE: 'notes:delete'
} as const
