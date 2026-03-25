/**
 * shared/types.ts — Tipos e constantes compartilhados entre Main, Preload e Renderer
 *
 * Centralizar os canais IPC em constantes evita erros de digitação e facilita
 * refatorações (renomear um canal atualiza todos os usos automaticamente).
 */

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string // ISO 8601
  updatedAt: string
}

export const IPC_CHANNELS = {
  NOTES_GET_ALL: 'notes:getAll',
  NOTES_CREATE: 'notes:create',
  NOTES_UPDATE: 'notes:update',
  NOTES_DELETE: 'notes:delete',
  NOTES_EXPORT: 'notes:export',
  NOTES_IMPORT: 'notes:import',
  APP_SHOW_NOTIFICATION: 'app:showNotification'
} as const
