/**
 * shared/types.ts — Tipos e constantes compartilhados entre Main, Preload e Renderer
 *
 * Este arquivo fica em `src/shared/` para ser importado por todos os processos.
 * Centralizar os canais IPC em constantes evita erros de digitação e facilita
 * refatorações (renomear um canal atualiza todos os usos automaticamente).
 *
 * Nesta lição, adicionamos canais para exportar, importar e mostrar notificações.
 */

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string // ISO 8601 — ex.: "2024-01-15T10:30:00.000Z"
  updatedAt: string
}

/**
 * Todos os canais IPC da aplicação.
 *
 * `as const` garante que os valores são tipos literais (não apenas `string`),
 * o que permite inferência de tipos mais precisa no TypeScript.
 *
 * Convenção de nomes: "domínio:ação" (ex.: "notes:create", "app:showNotification")
 */
export const IPC_CHANNELS = {
  // CRUD de notas
  NOTES_GET_ALL: 'notes:getAll',
  NOTES_CREATE: 'notes:create',
  NOTES_UPDATE: 'notes:update',
  NOTES_DELETE: 'notes:delete',

  // Novos nesta lição: arquivo e notificações
  NOTES_EXPORT: 'notes:export',
  NOTES_IMPORT: 'notes:import',
  APP_SHOW_NOTIFICATION: 'app:showNotification'
} as const
